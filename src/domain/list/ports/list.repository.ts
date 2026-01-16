import type {
  CreateUseCase,
  DeleteUseCase,
  GroupUseCase,
  ReadUseCase,
  SearchUseCase,
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
    SearchUseCase<List, ListFilterCriteria, ListSortField>,
    GroupUseCase<List, ListGroupCriteria> {}
