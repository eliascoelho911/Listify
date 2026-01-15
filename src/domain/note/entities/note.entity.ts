type BaseNote = {
  id: string;
  listId?: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UncheckableNote = BaseNote & {
  isCheckable: false;
};

export type CheckableNote = BaseNote & {
  isCheckable: true;
  isCompleted: boolean;
  completedAt?: Date;
  parentNoteId?: string;
};

export type Note = UncheckableNote | CheckableNote;

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateNoteInput = Partial<Omit<Note, 'id' | 'createdAt' | 'isCheckable'>>;
