import type { CreateUseCase, DeleteUseCase, ReadUseCase, UpdateUseCase } from '../../common';
import type { CreateTagInput, Tag, UpdateTagInput } from '../entities/tag.entity';

export interface TagRepository
  extends
    CreateUseCase<Tag, CreateTagInput>,
    ReadUseCase<Tag>,
    UpdateUseCase<Tag, UpdateTagInput>,
    DeleteUseCase {
  getByNoteId(noteId: string): Promise<Tag[]>;
}
