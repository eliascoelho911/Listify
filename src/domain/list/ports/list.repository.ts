import type {
  CreateUseCase,
  DeleteUseCase,
  FilterUseCase,
  GroupUseCase,
  ReadUseCase,
  UpdateUseCase,
} from '../../common';
import type { CreateListInput, List, UpdateListInput } from '../entities/list.entity';
import type { ListFilterCriteria, ListGroupCriteria, ListSortField } from '../types/list.filter';

export interface ListRepository
  extends
    CreateUseCase<List, CreateListInput>,
    ReadUseCase<List>,
    UpdateUseCase<List, UpdateListInput>,
    DeleteUseCase,
    FilterUseCase<List, ListFilterCriteria, ListSortField>,
    GroupUseCase<List, ListGroupCriteria> {}
