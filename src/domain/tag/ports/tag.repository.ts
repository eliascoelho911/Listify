import type {
  CreateUseCase,
  DeleteUseCase,
  ReadUseCase,
  SearchUseCase,
  UpdateUseCase,
} from '../../common';
import type { CreateTagInput, Tag, UpdateTagInput } from '../entities/tag.entity';
import type { TagFilterCriteria, TagSortField } from '../types';

export interface TagRepository
  extends
    CreateUseCase<Tag, CreateTagInput>,
    ReadUseCase<Tag>,
    UpdateUseCase<Tag, UpdateTagInput>,
    DeleteUseCase,
    SearchUseCase<Tag, TagFilterCriteria, TagSortField> {
  getByNoteId(noteId: string): Promise<Tag[]>;
}
