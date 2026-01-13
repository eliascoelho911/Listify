/**
 * Mock data for Inbox Storybook stories.
 *
 * Provides realistic test data for UserInputs, Tags, and DateGroups.
 */

import type { Tag, UserInput } from '@domain/inbox/entities';
import type { DateGroup } from '@domain/inbox/entities/types';

// Base date for consistent mock data
const NOW = new Date();
const YESTERDAY = new Date(NOW.getTime() - 24 * 60 * 60 * 1000);
const TWO_DAYS_AGO = new Date(NOW.getTime() - 2 * 24 * 60 * 60 * 1000);

/**
 * Mock Tags
 */
export const mockTags: Tag[] = [
  {
    id: 'tag-1',
    name: 'compras',
    usageCount: 5,
    createdAt: TWO_DAYS_AGO,
  },
  {
    id: 'tag-2',
    name: 'urgente',
    usageCount: 3,
    createdAt: YESTERDAY,
  },
  {
    id: 'tag-3',
    name: 'trabalho',
    usageCount: 8,
    createdAt: TWO_DAYS_AGO,
  },
  {
    id: 'tag-4',
    name: 'casa',
    usageCount: 2,
    createdAt: NOW,
  },
  {
    id: 'tag-5',
    name: 'saude',
    usageCount: 1,
    createdAt: NOW,
  },
];

/**
 * Mock UserInputs
 */
export const mockUserInputs: UserInput[] = [
  {
    id: 'input-1',
    text: 'Comprar leite e pão #compras #urgente',
    createdAt: new Date(NOW.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(NOW.getTime() - 2 * 60 * 60 * 1000),
    tags: [mockTags[0], mockTags[1]],
  },
  {
    id: 'input-2',
    text: 'Revisar relatório do projeto #trabalho',
    createdAt: new Date(NOW.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(NOW.getTime() - 4 * 60 * 60 * 1000),
    tags: [mockTags[2]],
  },
  {
    id: 'input-3',
    text: 'Ligar para o médico',
    createdAt: YESTERDAY,
    updatedAt: YESTERDAY,
    tags: [],
  },
  {
    id: 'input-4',
    text: 'Pagar conta de luz #casa #urgente',
    createdAt: new Date(YESTERDAY.getTime() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(YESTERDAY.getTime() - 3 * 60 * 60 * 1000),
    tags: [mockTags[3], mockTags[1]],
  },
  {
    id: 'input-5',
    text: 'Comprar presente de aniversário da Maria #compras',
    createdAt: TWO_DAYS_AGO,
    updatedAt: TWO_DAYS_AGO,
    tags: [mockTags[0]],
  },
];

/**
 * Single mock UserInput for simple stories
 */
export const mockSingleInput: UserInput = mockUserInputs[0];

/**
 * Mock UserInput without tags
 */
export const mockInputWithoutTags: UserInput = mockUserInputs[2];

/**
 * Mock UserInput with many tags
 */
export const mockInputWithManyTags: UserInput = {
  id: 'input-many-tags',
  text: 'Item com muitas tags #compras #urgente #trabalho #casa #saude',
  createdAt: NOW,
  updatedAt: NOW,
  tags: mockTags,
};

/**
 * Mock UserInput with long text
 */
export const mockInputWithLongText: UserInput = {
  id: 'input-long-text',
  text: 'Este é um texto muito longo para testar como o componente lida com conteúdo extenso. Ele deve quebrar corretamente e não estourar o layout. Vamos adicionar mais texto para garantir que temos pelo menos algumas linhas de conteúdo. #trabalho',
  createdAt: NOW,
  updatedAt: NOW,
  tags: [mockTags[2]],
};

/**
 * Mock DateGroups for grouped list display
 */
export const mockDateGroups: DateGroup[] = [
  {
    date: new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()),
    label: 'Hoje',
    variant: 'today',
    inputs: mockUserInputs.slice(0, 2),
  },
  {
    date: new Date(YESTERDAY.getFullYear(), YESTERDAY.getMonth(), YESTERDAY.getDate()),
    label: 'Ontem',
    variant: 'yesterday',
    inputs: mockUserInputs.slice(2, 4),
  },
  {
    date: new Date(TWO_DAYS_AGO.getFullYear(), TWO_DAYS_AGO.getMonth(), TWO_DAYS_AGO.getDate()),
    label: `${TWO_DAYS_AGO.getDate()} ${TWO_DAYS_AGO.toLocaleString('pt-BR', { month: 'short' })}`,
    variant: 'default',
    inputs: mockUserInputs.slice(4),
  },
];

/**
 * Empty mock data for empty state stories
 */
export const emptyUserInputs: UserInput[] = [];
export const emptyTags: Tag[] = [];
