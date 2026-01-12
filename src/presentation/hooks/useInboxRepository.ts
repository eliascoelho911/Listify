/**
 * useInboxRepository Hook
 *
 * Provides access to the InboxRepository through dependency injection.
 * This hook encapsulates the infrastructure coupling (Drizzle) in a single point,
 * allowing the rest of the presentation layer to remain decoupled from the ORM.
 */

import { useMemo } from 'react';
import { useDrizzle } from '@drizzle/DrizzleProvider';
import { InboxDrizzleRepo } from '@drizzle/InboxDrizzleRepo';

import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

/**
 * Hook that provides an InboxRepository instance.
 *
 * This is the only place in the presentation layer that knows about
 * the concrete implementation (InboxDrizzleRepo). All other components
 * and hooks should depend on the InboxRepository interface.
 *
 * @returns An InboxRepository instance
 */
export function useInboxRepository(): InboxRepository {
  const db = useDrizzle();
  return useMemo(() => new InboxDrizzleRepo(db), [db]);
}
