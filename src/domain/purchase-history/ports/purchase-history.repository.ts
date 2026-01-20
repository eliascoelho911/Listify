import type { BaseSortField, CreateUseCase, DeleteUseCase, ReadUseCase } from '../../common';
import type {
  CreatePurchaseHistoryInput,
  PurchaseHistory,
} from '../entities/purchase-history.entity';

export interface PurchaseHistoryRepository
  extends
    CreateUseCase<PurchaseHistory, CreatePurchaseHistoryInput>,
    ReadUseCase<PurchaseHistory, BaseSortField>,
    DeleteUseCase {
  getByListId(listId: string): Promise<PurchaseHistory[]>;
}
