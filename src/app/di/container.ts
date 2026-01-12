import { InboxSqliteRepo } from '@infra/storage/sqlite/InboxSqliteRepo';
import { ShoppingSqliteRepo } from '@infra/storage/sqlite/ShoppingSqliteRepo';
import { SqliteDatabase } from '@infra/storage/sqlite/SqliteDatabase';

import type { AppDependencies, BuildDependenciesOptions } from './types';

export async function buildDependencies(
  options: BuildDependenciesOptions = {},
): Promise<AppDependencies> {
  const database = new SqliteDatabase({ databaseName: options.databaseName });
  const shoppingRepository = new ShoppingSqliteRepo(database);
  const inboxRepository = new InboxSqliteRepo(database);

  await shoppingRepository.getActiveList();

  return {
    database,
    shoppingRepository,
    inboxRepository,
  };
}
