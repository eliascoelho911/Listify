export type SearchHistoryEntry = {
  id: string;
  query: string;
  searchedAt: Date;
};

export type CreateSearchHistoryEntryInput = Omit<SearchHistoryEntry, 'id'>;
