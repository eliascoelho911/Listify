export type SortDirection = 'asc' | 'desc';

// Trait for sortable entities (drag-and-drop reordering)
export type Sortable = {
  sortOrder: number;
};

// Batch update for sortable entities
export type SortOrderUpdate = {
  id: string;
  sortOrder: number;
};

// Base sort fields common to all entities
export type BaseSortField = 'createdAt' | 'updatedAt' | 'sortOrder';

// Sort criteria - excludes sortOrder as it's managed via drag-and-drop
export type SortCriteria<SortField extends BaseSortField | string> = {
  field: Omit<SortField, 'sortOrder'>;
  direction: SortDirection;
};
