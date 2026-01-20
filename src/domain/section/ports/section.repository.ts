import type {
  CreateUseCase,
  DeleteUseCase,
  ReadUseCase,
  UpdateSortOrderUseCase,
  UpdateUseCase,
} from '../../common';
import type { CreateSectionInput, Section, UpdateSectionInput } from '../entities/section.entity';
import type { SectionSortField } from '../types/section.filter';

export interface SectionRepository
  extends
    CreateUseCase<Section, CreateSectionInput>,
    ReadUseCase<Section, SectionSortField>,
    UpdateUseCase<Section, UpdateSectionInput>,
    DeleteUseCase,
    UpdateSortOrderUseCase {
  getByListId(listId: string): Promise<Section[]>;
}
