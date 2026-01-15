import type {
  CreateUseCase,
  DeleteUseCase,
  FilterUseCase,
  GroupUseCase,
  ReadUseCase,
  UpdateUseCase,
} from '../../common';
import type { CreateNoteInput, Note, UpdateNoteInput } from '../entities/note.entity';
import type { NoteFilterCriteria, NoteGroupCriteria } from '../types/note.filter';

export interface NoteRepository
  extends
    CreateUseCase<Note, CreateNoteInput>,
    ReadUseCase<Note>,
    UpdateUseCase<Note, UpdateNoteInput>,
    DeleteUseCase,
    FilterUseCase<Note, NoteFilterCriteria>,
    GroupUseCase<Note, NoteGroupCriteria> {
  getByListId(listId: string): Promise<Note[]>;
  getByTagId(tagId: string): Promise<Note[]>;
  getSubNotes(parentNoteId: string): Promise<Note[]>;
}
