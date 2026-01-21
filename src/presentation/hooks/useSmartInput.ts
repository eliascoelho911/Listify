/**
 * useSmartInput Hook
 *
 * Manages smart input state, parsing, and list suggestions for the SmartInputModal.
 * Integrates with SmartInputParserService and provides callbacks for modal interactions.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ParseContext, ParsedInput, SmartInputParser } from '@domain/common';
import type { ListType } from '@domain/list';
import type { ListSuggestion } from '@design-system/molecules/ListSuggestionDropdown/ListSuggestionDropdown.types';

export interface UseSmartInputOptions {
  /** Parser service instance */
  parser: SmartInputParser;

  /** Callback when user submits a parsed input */
  onSubmit?: (parsed: ParsedInput) => void;

  /** List of available lists for suggestions */
  availableLists?: { id: string; name: string; listType: ListType }[];

  /** Callback when user requests to create a new list */
  onCreateList?: (name: string) => void;

  /** Current list context (for :section syntax) */
  currentListName?: string;

  /** Whether current list is a shopping list (enables price extraction) */
  isShoppingList?: boolean;

  /** Initial input value */
  initialValue?: string;
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

  /** Callback when "Create new list" is pressed */
  createList: (name: string) => void;

  /** Whether a submission is in progress */
  isLoading: boolean;
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
  onSubmit,
  availableLists = [],
  onCreateList,
  currentListName,
  isShoppingList = false,
  initialValue = '',
}: UseSmartInputOptions): UseSmartInputReturn {
  const [value, setValue] = useState(initialValue);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    // Show suggestions when typing after @
    return typedListName !== null;
  }, [typedListName]);

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
      setVisible(false);
    }
  }, [parsed, onSubmit]);

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

  // Handle create new list
  const createList = useCallback(
    (name: string) => {
      onCreateList?.(name);

      // Replace the @mention with the new list name
      const beforeAt = value.slice(0, value.lastIndexOf('@'));
      const newValue = `${beforeAt}@${name} `;
      setValue(newValue);
    },
    [value, onCreateList],
  );

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
  };
}
