import type { BaseFilterCriteria, GetByIdUseCase, SearchUseCase } from '../../common';
import type { BookMetadata, GameMetadata, MovieMetadata } from '../entities/item.entity';

// Resultado base de busca externa
type BaseSearchResult = {
  externalId: string;
  title: string;
};

// Resultados de busca por categoria
export type MovieSearchResult = BaseSearchResult & {
  metadata: MovieMetadata;
};

export type BookSearchResult = BaseSearchResult & {
  metadata: BookMetadata;
};

export type GameSearchResult = BaseSearchResult & {
  metadata: GameMetadata;
};

// Repositórios para provedores externos
export type MovieProviderRepository = GetByIdUseCase<MovieSearchResult> &
  SearchUseCase<MovieSearchResult, BaseFilterCriteria>;

export type BookProviderRepository = GetByIdUseCase<BookSearchResult> &
  SearchUseCase<BookSearchResult, BaseFilterCriteria>;

export type GameProviderRepository = GetByIdUseCase<GameSearchResult> &
  SearchUseCase<GameSearchResult, BaseFilterCriteria>;
