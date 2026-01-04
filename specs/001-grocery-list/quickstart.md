# Quickstart — Listify (Expo)

**Data**: 2026-01-04 | **Plano**: `specs/001-grocery-list/plan.md`

Este quickstart descreve como iniciar o projeto Expo e rodar as rotinas de qualidade e Storybook.

## 1) Criar o app (v1.0)

> Sugestão: usar `create-expo-app` com template TypeScript e já habilitar Expo Router.

Checklist de bootstrap:

- Criar app Expo com TypeScript.
- Adicionar Expo Router e criar pasta `app/` (se o template não criar).
- Criar `src/` com as camadas (domain/data/infra/presentation/design-system).
- Configurar aliases de import (TS + Babel) para evitar `../../..`.

## 2) Rodar o app

- Dev server: `npx expo start`
- iOS/Android: usar simulador/emulador ou Expo Go (conforme dependências).

## 3) Lint, format e testes

Comandos esperados (a definir quando o `package.json` existir):

- Lint: `npm run lint`
- Format: `npm run format`
- Test: `npm test`

## 4) Storybook

Estratégia recomendada no Expo:

- Rodar Storybook dentro do próprio app, alternando por env var/script.
- Scripts esperados:
  - `npm run storybook` (inicia app em modo Storybook)
  - `npm run storybook:generate` (se houver geração de stories/index)
