/**
 * Tabs Layout
 *
 * Main navigation tabs layout using Expo Router with custom Bottombar.
 * Integrates SmartInputModal with FAB for quick item/list creation.
 */

import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';

import { useAppDependencies } from '@app/di';
import type { ParsedInput } from '@domain/common';
import type { CreateItemInput, ItemType } from '@domain/item';
import type { List, ListType } from '@domain/list';
import { useItemStoreWithDI, useSmartInput } from '@presentation/hooks';
import type { SelectableListType } from '@design-system/molecules/MiniCategorySelector/MiniCategorySelector.types';
import type { BottombarTabName, SmartInputMode } from '@design-system/organisms';
import { Bottombar, SmartInputModal } from '@design-system/organisms';
import { useTheme } from '@design-system/theme';

/**
 * Maps list type to item type
 */
function getItemTypeFromListType(listType: ListType): ItemType {
  switch (listType) {
    case 'notes':
      return 'note';
    case 'shopping':
      return 'shopping';
    case 'movies':
      return 'movie';
    case 'books':
      return 'book';
    case 'games':
      return 'game';
    default: {
      const exhaustiveCheck: never = listType;
      throw new Error(`Unknown list type: ${exhaustiveCheck}`);
    }
  }
}

export default function TabsLayout(): ReactElement {
  const { theme } = useTheme();
  const { smartInputParser, categoryInference, listRepository } = useAppDependencies();

  // Item store for creating items
  const itemStore = useItemStoreWithDI();

  // Smart input mode - 'item' for creating items, 'list' for creating lists
  const [smartInputMode, setSmartInputMode] = useState<SmartInputMode>('item');

  // Local state for available lists
  const [availableLists, setAvailableLists] = useState<
    { id: string; name: string; listType: ListType }[]
  >([]);

  // Load available lists on mount
  useEffect(() => {
    const loadLists = async (): Promise<void> => {
      try {
        const result = await listRepository.getAll();
        setAvailableLists(
          result.items.map((list: List) => ({
            id: list.id,
            name: list.name,
            listType: list.listType,
          })),
        );
        console.debug('[TabsLayout] Loaded lists:', result.items.length);
      } catch (error) {
        console.error('[TabsLayout] Failed to load lists:', error);
      }
    };

    loadLists();
  }, [listRepository]);

  // Handle submission of parsed input - create item
  const handleSubmit = useCallback(
    async (parsed: ParsedInput): Promise<void> => {
      console.debug('[TabsLayout] SmartInput submitted:', parsed);

      // Determine target list
      let targetList: List | null = null;
      if (parsed.listName) {
        targetList = availableLists.find(
          (l) => l.name.toLowerCase() === parsed.listName?.toLowerCase(),
        ) as List | null;
      }

      // Determine item type based on target list
      // If no list, default to 'note' (goes to Inbox)
      const itemType: ItemType = targetList ? getItemTypeFromListType(targetList.listType) : 'note';

      // Build create input based on item type
      const baseInput = {
        title: parsed.title || 'Untitled',
        listId: targetList?.id,
        sectionId: undefined, // TODO: Handle section selection
        sortOrder: 0,
      };

      let createInput: CreateItemInput;

      switch (itemType) {
        case 'note':
          createInput = {
            ...baseInput,
            type: 'note',
          };
          break;

        case 'shopping':
          createInput = {
            ...baseInput,
            type: 'shopping',
            quantity: parsed.quantity ?? undefined,
            price: parsed.price ?? undefined,
            isChecked: false,
          };
          break;

        case 'movie':
          createInput = {
            ...baseInput,
            type: 'movie',
            isChecked: false,
          };
          break;

        case 'book':
          createInput = {
            ...baseInput,
            type: 'book',
            isChecked: false,
          };
          break;

        case 'game':
          createInput = {
            ...baseInput,
            type: 'game',
            isChecked: false,
          };
          break;

        default: {
          const exhaustiveCheck: never = itemType;
          throw new Error(`Unknown item type: ${exhaustiveCheck}`);
        }
      }

      // Create the item via store
      const created = await itemStore.getState().createItem(createInput);

      if (created) {
        console.debug('[TabsLayout] Item created:', created.id);
      } else {
        console.error('[TabsLayout] Failed to create item');
      }
    },
    [availableLists, itemStore],
  );

  // Handle creation of new list
  const handleCreateList = useCallback(
    async (name: string, listType: ListType): Promise<void> => {
      console.debug('[TabsLayout] Create new list:', name, listType);

      try {
        const newList = await listRepository.create({
          name,
          listType,
          isPrefabricated: false,
        });

        // Add to available lists
        setAvailableLists((prev) => [
          ...prev,
          { id: newList.id, name: newList.name, listType: newList.listType },
        ]);

        console.debug('[TabsLayout] List created:', newList.id);
      } catch (error) {
        console.error('[TabsLayout] Failed to create list:', error);
      }
    },
    [listRepository],
  );

  // Smart input hook for managing modal state and parsing
  const {
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
  } = useSmartInput({
    parser: smartInputParser,
    categoryInference,
    onSubmit: handleSubmit,
    onCreateList: handleCreateList,
    availableLists,
  });

  // Handle FAB press - determines mode based on current tab
  const handleFABPress = useCallback(
    (currentTab: BottombarTabName) => {
      const mode: SmartInputMode = currentTab === 'lists' ? 'list' : 'item';
      setSmartInputMode(mode);
      open();
    },
    [open],
  );

  // Handle category selection in list mode - creates the list
  const handleListModeSelectCategory = useCallback(
    async (type: SelectableListType) => {
      const listName = value.trim();
      if (!listName) {
        return;
      }

      await handleCreateList(listName, type);
      setValue('');
      close();
    },
    [value, handleCreateList, setValue, close],
  );

  // Handle modal close - reset mode to item
  const handleModalClose = useCallback(() => {
    close();
    setSmartInputMode('item');
  }, [close]);

  return (
    <>
      <Tabs
        tabBar={(props) => <Bottombar {...props} onFABPress={handleFABPress} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inbox',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notas',
          }}
        />
        <Tabs.Screen
          name="lists"
          options={{
            title: 'Listas',
          }}
        />
      </Tabs>

      <SmartInputModal
        mode={smartInputMode}
        visible={visible}
        onClose={handleModalClose}
        onSubmit={submit}
        value={value}
        onChangeText={setValue}
        parsed={parsed}
        listSuggestions={listSuggestions}
        showSuggestions={showSuggestions}
        onSelectList={selectList}
        onCreateList={createList}
        isLoading={isLoading}
        showCategorySelector={showCategorySelector}
        pendingListName={pendingListCreation?.name}
        inferredCategoryType={pendingListCreation?.inferredType}
        onSelectCategory={
          smartInputMode === 'list' ? handleListModeSelectCategory : confirmCategorySelection
        }
        onCancelCategorySelection={cancelCategorySelection}
      />
    </>
  );
}
