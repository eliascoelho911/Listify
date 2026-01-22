/**
 * useDragAndDrop Hook
 *
 * Manages drag and drop reordering state and persistence.
 * Handles optimistic updates with rollback on error.
 */

import { useCallback, useState } from 'react';

export interface DraggableItem {
  id: string;
  sortOrder: number;
}

export interface UseDragAndDropOptions<T extends DraggableItem> {
  /**
   * Initial items to manage
   */
  initialItems: T[];

  /**
   * Callback to persist the new order
   * Should return a promise that resolves when persistence is complete
   */
  onPersist: (items: T[]) => Promise<void>;

  /**
   * Optional callback for when drag starts
   */
  onDragStart?: () => void;

  /**
   * Optional callback for when drag ends
   */
  onDragEnd?: () => void;
}

export interface UseDragAndDropResult<T extends DraggableItem> {
  /**
   * Current items in their current order
   */
  items: T[];

  /**
   * Whether a drag operation is in progress
   */
  isDragging: boolean;

  /**
   * Whether the items are being persisted
   */
  isPersisting: boolean;

  /**
   * Error from the last persist operation
   */
  error: Error | null;

  /**
   * Handle drag end - updates local state and triggers persistence
   */
  handleDragEnd: (reorderedItems: T[]) => void;

  /**
   * Set dragging state (called by the list component)
   */
  setIsDragging: (dragging: boolean) => void;

  /**
   * Update items externally (e.g., after adding/removing items)
   */
  setItems: (items: T[]) => void;

  /**
   * Clear any error state
   */
  clearError: () => void;
}

export function useDragAndDrop<T extends DraggableItem>({
  initialItems,
  onPersist,
  onDragStart,
  onDragEnd,
}: UseDragAndDropOptions<T>): UseDragAndDropResult<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isDragging, setIsDragging] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep a backup for rollback
  const [backup, setBackup] = useState<T[] | null>(null);

  const handleDragEnd = useCallback(
    async (reorderedItems: T[]) => {
      // Store backup for potential rollback
      setBackup(items);

      // Optimistic update
      setItems(reorderedItems);
      setIsDragging(false);
      onDragEnd?.();

      // Persist the changes
      setIsPersisting(true);
      setError(null);

      try {
        await onPersist(reorderedItems);
        // Success - clear backup
        setBackup(null);
      } catch (err) {
        // Rollback on error
        console.debug('[useDragAndDrop] Persist failed, rolling back:', err);
        if (backup) {
          setItems(backup);
        }
        setError(err instanceof Error ? err : new Error('Failed to persist order'));
      } finally {
        setIsPersisting(false);
      }
    },
    [items, backup, onPersist, onDragEnd],
  );

  const handleSetIsDragging = useCallback(
    (dragging: boolean) => {
      setIsDragging(dragging);
      if (dragging) {
        onDragStart?.();
      }
    },
    [onDragStart],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    isDragging,
    isPersisting,
    error,
    handleDragEnd,
    setIsDragging: handleSetIsDragging,
    setItems,
    clearError,
  };
}
