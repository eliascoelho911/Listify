import type { DateRange } from '../../common';

export type NoteFilterCriteria = {
  query?: string;
  tagIds?: string[];
  listId?: string;
  isCompleted?: boolean;
  isCheckable?: boolean;
  createdDateRange?: DateRange;
  updatedDateRange?: DateRange;
};

export type NoteGroupCriteria = 'listId' | 'isCompleted' | 'createdAt:day' | 'updatedAt:day';
