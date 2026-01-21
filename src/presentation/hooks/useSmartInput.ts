/**
 * useSmartInput Hook
 *
 * Manages smart input state, parsing, and list suggestions for the SmartInputModal.
 * Integrates with SmartInputParserService and CategoryInferenceService.
 * Handles category inference flow when creating new lists.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  CategoryInference,
  ParseContext,
  ParsedInput,
  SmartInputParser,
} from '@domain/common';
import type { ListType } from '@domain/list';
import type { ListSuggestion } from '@design-system/molecules/ListSuggestionDropdown/ListSuggestionDropdown.types';
import type { SelectableListType } from '@design-system/molecules/MiniCategorySelector/MiniCategorySelector.types';

export interface UseSmartInputOptions {
  /** Parser service instance */
  parser: SmartInputParser;

  /** Category inference service instance */
  categoryInference: CategoryInference;

  /** Callback when user submits a parsed input */
  onSubmit?: (parsed: ParsedInput) => void;

  /** List of available lists for suggestions */
  availableLists?: { id: string; name: string; listType: ListType }[];

  /** Callback when user requests to create a new list */
  onCreateList?: (name: string, listType: ListType) => void;

  /** Current list context (for :section syntax) */
  currentListName?: string;

  /** Whether current list is a shopping list (enables price extraction) */
  isShoppingList?: boolean;

  /** Initial input value */
  initialValue?: string;

  /**
   * Whether to keep modal open after submit (for continuous creation)
   * @default true
   */
  keepOpenAfterSubmit?: boolean;
}

/**
 * State for pending list creation (when showing category selector)
 */
export interface PendingListCreation {
  /** Name of the list to create */
  name: string;

  /** Inferred type from the inference service */
  inferredType: SelectableListType;
}

export interface UseSmartInputReturn {
  /** Current input value */
  value: string;

  /** Update input value */
  setValue: (text: string) => void;

  /** Current parsed result */
  parsed: ParsedInput;

  /** Whether the modal is visible */
  visible: boolean;

  /** Open the modal */
  open: () => void;

  /** Close the modal */
  close: () => void;

  /** Submit the current input */
  submit: () => void;

  /** List suggestions filtered by current input */
  listSuggestions: ListSuggestion[];

  /** Whether to show the suggestions dropdown */
  showSuggestions: boolean;

  /** Callback when a list is selected from suggestions */
  selectList: (list: ListSuggestion) => void;

  /** Callback when "Create new list" is pressed (triggers inference flow) */
  createList: (name: string) => void;

  /** Whether a submission is in progress */
  isLoading: boolean;

  /** Whether the category selector should be shown */
  showCategorySelector: boolean;

  /** Pending list creation (for category selector) */
  pendingListCreation: PendingListCreation | null;

  /** Callback when user selects a category in the selector */
  confirmCategorySelection: (type: SelectableListType) => void;

  /** Cancel category selection */
  cancelCategorySelection: () => void;
}

const EMPTY_PARSED: ParsedInput = {
  title: '',
  listName: null,
  sectionName: null,
  quantity: null,
  price: null,
  rawText: '',
  highlights: [],
};

/**
 * Hook for managing smart input state and interactions
 */
export function useSmartInput({
  parser,
  categoryInference,
  onSubmit,
  availableLists = [],
  onCreateList,
  currentListName,
  isShoppingList = false,
  initialValue = '',
  keepOpenAfterSubmit = true,
}: UseSmartInputOptions): UseSmartInputReturn {
  const [value, setValue] = useState(initialValue);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for category selection flow
  const [pendingListCreation, setPendingListCreation] = useState<PendingListCreation | null>(null);

  // Parse context for the parser
  const parseContext = useMemo(
    (): ParseContext => ({
      currentListName,
      isShoppingList,
    }),
    [currentListName, isShoppingList],
  );

  // Parse the current input value
  const parsed = useMemo((): ParsedInput => {
    if (!value.trim()) {
      return EMPTY_PARSED;
    }
    return parser.parse(value, parseContext);
  }, [value, parser, parseContext]);

  // Extract the list name being typed (for filtering suggestions)
  const typedListName = useMemo((): string | null => {
    const match = /@([^\s:@]*)$/.exec(value);
    return match ? match[1] : null;
  }, [value]);

  // Determine if we should show suggestions
  const showSuggestions = useMemo((): boolean => {
    // Show suggestions when typing after @ and not showing category selector
    return typedListName !== null && !pendingListCreation;
  }, [typedListName, pendingListCreation]);

  // Determine if we should show the category selector
  const showCategorySelector = pendingListCreation !== null;

  // Filter available lists based on typed name
  const listSuggestions = useMemo((): ListSuggestion[] => {
    if (typedListName === null) {
      return [];
    }

    const searchText = typedListName.toLowerCase();

    // Filter lists that match the search text
    const filtered = availableLists
      .filter((list) => list.name.toLowerCase().includes(searchText))
      .map(
        (list): ListSuggestion => ({
          id: list.id,
          name: list.name,
          listType: list.listType,
        }),
      );

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [availableLists, typedListName]);

  // Open the modal
  const open = useCallback(() => {
    setVisible(true);
  }, []);

  // Close the modal
  const close = useCallback(() => {
    setVisible(false);
    // Reset value when closing
    setValue('');
    setPendingListCreation(null);
  }, []);

  // Submit the current input
  const submit = useCallback(() => {
    if (!parsed.title.trim() && !parsed.listName) {
      return;
    }

    setIsLoading(true);

    try {
      onSubmit?.(parsed);
    } finally {
      setIsLoading(false);
      setValue('');
      setPendingListCreation(null);

      // Only close modal if keepOpenAfterSubmit is false
      if (!keepOpenAfterSubmit) {
        setVisible(false);
      }
    }
  }, [parsed, onSubmit, keepOpenAfterSubmit]);

  // Handle list selection from suggestions
  const selectList = useCallback(
    (list: ListSuggestion) => {
      // Replace the @mention with the selected list
      const beforeAt = value.slice(0, value.lastIndexOf('@'));
      const newValue = `${beforeAt}@${list.name} `;
      setValue(newValue);
    },
    [value],
  );

  // Handle create new list - triggers inference flow
  const createList = useCallback(
    (name: string) => {
      if (!onCreateList) {
        return;
      }

      // Run category inference on the current input
      const inferenceResult = categoryInference.infer(value);

      // If high confidence, create immediately
      if (inferenceResult.confidence === 'high') {
        onCreateList(name, inferenceResult.listType);

        // Replace the @mention with the new list name
        const beforeAt = value.slice(0, value.lastIndexOf('@'));
        const newValue = `${beforeAt}@${name} `;
        setValue(newValue);
        return;
      }

      // For low/medium confidence, show category selector
      // Map 'notes' to 'shopping' as fallback since 'notes' is not selectable
      const inferredType: SelectableListType =
        inferenceResult.listType === 'notes'
          ? 'shopping'
          : (inferenceResult.listType as SelectableListType);

      setPendingListCreation({
        name,
        inferredType,
      });
    },
    [value, categoryInference, onCreateList],
  );

  // Confirm category selection from the selector
  const confirmCategorySelection = useCallback(
    (type: SelectableListType) => {
      if (!pendingListCreation || !onCreateList) {
        return;
      }

      // Create the list with the selected type
      onCreateList(pendingListCreation.name, type);

      // Replace the @mention with the new list name
      const beforeAt = value.slice(0, value.lastIndexOf('@'));
      const newValue = `${beforeAt}@${pendingListCreation.name} `;
      setValue(newValue);

      // Clear pending state
      setPendingListCreation(null);
    },
    [pendingListCreation, onCreateList, value],
  );

  // Cancel category selection
  const cancelCategorySelection = useCallback(() => {
    setPendingListCreation(null);
  }, []);

  // Reset value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    setValue,
    parsed,
    visible,
    open,
    close,
    submit,
    listSuggestions,
    showSuggestions,
    selectList,
    createList,
    isLoading,
    showCategorySelector,
    pendingListCreation,
    confirmCategorySelection,
    cancelCategorySelection,
  };
}
