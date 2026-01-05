# Guia de Desenvolvimento: Listify

Auto-gerado a partir de todos os planos de feature. Última atualização: 2026-01-04

## Tecnologias Ativas

- TypeScript (strict) + Expo SDK + React Native + Expo Router (001-grocery-list)

## Estrutura do Projeto

```text
src/
tests/
```

## Comandos

npm test && npm run lint

## Estilo de Código

TypeScript (strict): Follow standard conventions

## Mudanças Recentes

- 001-grocery-list: Added TypeScript (strict) + Expo SDK + React Native + Expo Router

<!-- MANUAL ADDITIONS START -->

- Use `ReactElement` instead of `JSX.Element` in component return types.
- Evitar valores hard coded (cores, tipografia, espaçamentos e outros); sempre preferir tokens do Design System para garantir reuso e consistencia visual.
- Internacionalização (pt-BR + en) é obrigatória: todo texto de UI MUST vir de `t(...)`/`<Trans />` (react-i18next); não deixar strings hard coded em componentes/screens.
- Locale MUST ser detectado via `expo-localization` com fallback seguro (ex.: `en`) e lista explícita de idiomas suportados.
- Evitar strings hardcoded para locale; use constantes compartilhadas (ex.: `FALLBACK_LOCALE` em `src/domain/shopping/constants.ts`).
- Dados do usuário (ex.: nome do item, categorias customizadas) MUST NOT ser traduzidos automaticamente; apenas UI/copy é traduzível.
- Categorias/unidades pré-definidas SHOULD usar identificadores/códigos estáveis e labels via i18n (evitar persistir nomes localizados no banco).
- Formatação de moeda/número/data SHOULD usar `Intl.*Format` com o locale ativo + `currencyCode` da lista (sem hardcode de separadores/símbolos).
- Rodar `npx prettier --write <arquivos modificados>` para formatar tudo que foi alterado antes de subir SOMENTE QUANDO houver mudanças significativas.
- Executar sempre `npm test && npm run lint` antes de subir mudanças SOMENTE QUANDO houver mudanças significativas.
<!-- MANUAL ADDITIONS END -->
