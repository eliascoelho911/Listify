# Research (decisões técnicas) — Listify v1.0

**Data**: 2026-01-04 | **Spec**: `specs/001-grocery-list/spec.md` | **Plano**: `specs/001-grocery-list/plan.md`

Este documento consolida decisões do stack e da arquitetura para reduzir rework na implementação.

## Decisão: Expo (managed) + Expo Router

- **Escolha**: Expo (managed) + Expo Router para navegação file-based.
- **Racional**: minimiza setup e riscos de build; Router simplifica rotas e deep linking.
- **Alternativas consideradas**:
  - RN bare: mais controle, mas mais atrito e manutenção.
  - React Navigation “manual”: funciona, porém com mais boilerplate para um MVP.

## Decisão: Clean Architecture com DI simples (sem framework)

- **Escolha**: camadas `presentation/domain/data/infra` com *composition root* em `src/app/di`.
- **Racional**: mantém o domínio testável e evita acoplamento com Expo/RN.
- **Alternativas consideradas**:
  - Colocar lógica em hooks/componentes: rápido no curto prazo, caro para evoluir.
  - Framework de DI: aumenta complexidade e não entrega valor no MVP.

## Decisão: Estado de UI com Zustand

- **Escolha**: Zustand para estado/view-model na camada `presentation`.
- **Racional**: simples, escalável para telas adicionais e sem boilerplate.
- **Alternativas consideradas**:
  - Context+hooks: ok no MVP, mas tende a ficar verboso com mais fluxos.
  - Jotai: também simples; Zustand foi preferido por facilidade de modelar “store” com ações.

## Decisão: Persistência local com `expo-sqlite`

- **Escolha**: `expo-sqlite` com SQL direto e migrações via `PRAGMA user_version`.
- **Racional**: atende bem busca/ordenção/histórico e dá caminho claro de migração (v1.1/v2.0).
- **Alternativas consideradas**:
  - AsyncStorage: simples, mas frágil para migrações e consultas.
  - ORMs: reduzem SQL manual, mas adicionam complexidade e superfície de bugs.

## Decisão: ESLint + Prettier + regras de fronteira

- **Escolha**: `eslint-config-universe` + `@typescript-eslint` e Prettier (integrado).
- **Racional**: baseline boa para Expo; adiciona enforce de camadas (imports restritos).
- **Alternativas consideradas**:
  - Só ESLint: funciona, mas tende a divergência de formatação em time.

## Decisão: Storybook desde o início (design system)

- **Escolha**: Storybook React Native para isolar componentes do design system.
- **Racional**: acelera iteração visual e reduz regressão de UI.
- **Alternativas consideradas**:
  - “Screen sandbox” manual: menos setup, mas menos sistemático e menos reutilizável.

## Decisão: Internacionalização (pt-BR + en) com `react-i18next` + `expo-localization`

- **Escolha**: `i18next` + `react-i18next` para traduções, com detecção de idioma por `expo-localization`.
- **Racional**: requisito do projeto (pt-BR/en) desde o MVP; evita strings hard coded e reduz rework em UX/copy.
- **Alternativas consideradas**:
  - “Strings soltas” por tela: rápido no curto prazo, mas vira dívida técnica e dificulta consistência.
  - Outras libs de i18n: viáveis, mas `react-i18next` é bem estabelecida e flexível (pluralização/interpolação).
