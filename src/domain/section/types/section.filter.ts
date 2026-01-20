import type { BaseSortField } from '@domain/common';

// Sorting (sortOrder is already in BaseSortField)
export type SectionSortField = BaseSortField | 'name';
