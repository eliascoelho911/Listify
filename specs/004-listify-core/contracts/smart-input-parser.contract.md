# Contrato: Smart Input Parser

**Branch**: `004-listify-core` | **Data**: 2026-01-20 | **Plan**: [../plan.md](../plan.md)

Este documento define o contrato interno do serviço de parsing de entrada inteligente do Listify.

---

## 1. Visão Geral

O Smart Input Parser é responsável por extrair elementos estruturados de texto livre digitado pelo usuário. É o componente central da proposta de valor do Listify: entrada ultra-rápida em uma única linha.

### Exemplos de Entrada

| Input | Lista | Seção | Título | Quantidade | Preço |
|-------|-------|-------|--------|------------|-------|
| `Leite @Mercado` | Mercado | - | Leite | - | - |
| `Leite 2L R$8,50 @Mercado` | Mercado | - | Leite | 2L | R$8,50 |
| `Pão de forma @Mercado:Padaria` | Mercado | Padaria | Pão de forma | - | - |
| `Comprar ovos :Urgente` | (atual) | Urgente | Comprar ovos | - | - |
| `Minha ideia importante` | - | - | Minha ideia importante | - | - |

---

## 2. Interface do Serviço

### Port no Domain (Abstração)

```typescript
// src/domain/common/ports/smart-input-parser.port.ts

/**
 * Resultado do parsing de entrada inteligente
 */
export interface ParsedInput {
  /** Título extraído (texto após remover elementos parseáveis) */
  title: string;

  /** Nome da lista referenciada (@lista), ou null se não especificada */
  listName: string | null;

  /** Nome da seção referenciada (@lista:seção ou :seção), ou null se não especificada */
  sectionName: string | null;

  /** Quantidade extraída (ex: "2kg", "500ml"), ou null se não presente */
  quantity: string | null;

  /** Valor monetário extraído, ou null se não presente */
  price: number | null;

  /** Texto original não modificado */
  rawText: string;

  /** Posições para inline highlighting */
  highlights: Highlight[];
}

/**
 * Highlight para marcação visual no campo de entrada
 */
export interface Highlight {
  /** Tipo do elemento destacado */
  type: 'list' | 'section' | 'price' | 'quantity';

  /** Posição inicial no texto original (0-indexed) */
  start: number;

  /** Posição final no texto original (exclusive) */
  end: number;

  /** Valor do texto destacado */
  value: string;
}

/**
 * Contexto opcional para parsing
 */
export interface ParseContext {
  /** Lista atual (para sintaxe :seção) */
  currentListName?: string;

  /** Se a lista destino é do tipo shopping (habilita extração de preço) */
  isShoppingList?: boolean;
}

/**
 * Interface do serviço de parsing de entrada inteligente
 */
export interface SmartInputParser {
  /**
   * Faz o parsing de texto de entrada inteligente
   *
   * @param text - Texto digitado pelo usuário
   * @param context - Contexto opcional (lista atual, tipo de lista)
   * @returns Resultado estruturado do parsing
   */
  parse(text: string, context?: ParseContext): ParsedInput;
}
```

### Implementação no Infra

```typescript
// src/infra/services/SmartInputParserService.ts
import type { SmartInputParser, ParsedInput, ParseContext } from '@domain/common/ports';

export class SmartInputParserService implements SmartInputParser {
  parse(text: string, context?: ParseContext): ParsedInput {
    // Implementação das regras de parsing
  }
}
```

### Acesso via DI

```typescript
// src/presentation/hooks/useSmartInput.ts
const { smartInputParser } = useAppDependencies();
const parsed = smartInputParser.parse(text, context);
```

---

## 3. Regras de Parsing

### 3.1 Referência de Lista (`@lista`)

**Padrão**: `@[nome_da_lista]`

- Captura qualquer texto após `@` até encontrar `:`, espaço ou fim da string
- Case-sensitive para match com listas existentes
- Se lista não existe, sinaliza para criação

**Exemplos**:
- `@Mercado` → listName: "Mercado"
- `@Filmes para Ver` → listName: "Filmes" (espaço termina)
- `@"Filmes para Ver"` → NOT SUPPORTED (aspas não são interpretadas)

### 3.2 Referência de Seção (`@lista:seção` ou `:seção`)

**Padrão**: `@[lista]:[seção]` ou `:[seção]`

- `:` é o separador entre lista e seção
- Se apenas `:seção`, usa lista do contexto
- Captura texto após `:` até espaço ou fim

**Exemplos**:
- `@Mercado:Padaria` → listName: "Mercado", sectionName: "Padaria"
- `:Urgente` → sectionName: "Urgente" (lista do contexto)
- `@Mercado:` → listName: "Mercado", sectionName: null (: sem texto)

### 3.3 Valor Monetário (`R$X,XX`)

**Padrão**: `R\$\s?(\d+(?:[.,]\d{1,2})?)`

- Só extraído se `context.isShoppingList === true`
- Aceita formatos: `R$10`, `R$ 10`, `R$10,50`, `R$10.50`
- Normalizado para número decimal

**Exemplos**:
- `R$8,50` → price: 8.50
- `R$ 10` → price: 10.00
- `R$5.99` → price: 5.99
- `10,50` → NOT extracted (precisa do prefixo R$)

### 3.4 Quantidade (`Xunidade`)

**Padrão**: `(\d+(?:[.,]\d+)?)\s?(kg|g|l|ml|un|pc|pç|dz|cx)`

- Aceita números inteiros ou decimais
- Unidades suportadas (case-insensitive):
  - Peso: `kg`, `g`
  - Volume: `l`, `ml`
  - Contagem: `un`, `pc`, `pç`, `dz` (dúzia), `cx` (caixa)

**Exemplos**:
- `2kg` → quantity: "2kg"
- `500ml` → quantity: "500ml"
- `1,5L` → quantity: "1,5L"
- `12un` → quantity: "12un"

### 3.5 Título (Restante)

- Tudo que não foi capturado pelos padrões anteriores
- Trim de espaços extras
- Se título vazio após extração, usar texto original

---

## 4. Ordem de Processamento

1. **Identificar lista e seção** (`@lista:seção` ou `@lista` ou `:seção`)
2. **Identificar valor monetário** (se contexto de compras)
3. **Identificar quantidade**
4. **Extrair título** (restante após remover elementos)
5. **Gerar highlights** (ordenados por posição)

---

## 5. Casos de Borda

### 5.1 Múltiplas Referências de Lista

```typescript
// Input: "Comprar @Mercado e @Padaria"
// Comportamento: Usa a PRIMEIRA referência encontrada
parser.parse("Comprar @Mercado e @Padaria")
// → listName: "Mercado", title: "Comprar e @Padaria"
```

### 5.2 Preço sem Contexto de Compras

```typescript
// Input: "R$50 @Filmes"
// Comportamento: Preço NÃO é extraído se lista não é shopping
parser.parse("R$50 @Filmes", { isShoppingList: false })
// → price: null, title: "R$50"
```

### 5.3 Texto Vazio ou Só Espaços

```typescript
// Input: "   "
parser.parse("   ")
// → title: "", listName: null, price: null, quantity: null
```

### 5.4 Apenas Referência sem Título

```typescript
// Input: "@Mercado"
parser.parse("@Mercado")
// → title: "", listName: "Mercado"
// UX: Mostrar erro "Digite o título do item"
```

### 5.5 Caracteres Especiais no Nome

```typescript
// Input: "Café @Mercado"
parser.parse("Café @Mercado")
// → title: "Café", listName: "Mercado"
// Acentos e caracteres UTF-8 são preservados
```

---

## 6. Testes de Aceitação

```typescript
import { SmartInputParserService } from '@infra/services/SmartInputParserService';
import type { SmartInputParser } from '@domain/common/ports';

describe('SmartInputParser', () => {
  let parser: SmartInputParser;

  beforeEach(() => {
    parser = new SmartInputParserService();
  });

  describe('lista reference', () => {
    it('should extract list name after @', () => {
      const result = parser.parse('Leite @Mercado');
      expect(result.listName).toBe('Mercado');
      expect(result.title).toBe('Leite');
    });

    it('should extract list and section with : separator', () => {
      const result = parser.parse('Pão @Mercado:Padaria');
      expect(result.listName).toBe('Mercado');
      expect(result.sectionName).toBe('Padaria');
      expect(result.title).toBe('Pão');
    });

    it('should extract section only with : prefix', () => {
      const result = parser.parse('Urgente :Hoje', { currentListName: 'Tarefas' });
      expect(result.listName).toBeNull();
      expect(result.sectionName).toBe('Hoje');
      expect(result.title).toBe('Urgente');
    });
  });

  describe('price extraction', () => {
    it('should extract price when isShoppingList is true', () => {
      const result = parser.parse('Leite R$8,50', { isShoppingList: true });
      expect(result.price).toBe(8.50);
      expect(result.title).toBe('Leite');
    });

    it('should NOT extract price when isShoppingList is false', () => {
      const result = parser.parse('Ingresso R$50', { isShoppingList: false });
      expect(result.price).toBeNull();
      expect(result.title).toBe('Ingresso R$50');
    });

    it('should handle different price formats', () => {
      expect(parser.parse('A R$10', { isShoppingList: true }).price).toBe(10);
      expect(parser.parse('A R$ 10', { isShoppingList: true }).price).toBe(10);
      expect(parser.parse('A R$10,99', { isShoppingList: true }).price).toBe(10.99);
      expect(parser.parse('A R$10.99', { isShoppingList: true }).price).toBe(10.99);
    });
  });

  describe('quantity extraction', () => {
    it('should extract quantity with unit', () => {
      const result = parser.parse('Leite 2L');
      expect(result.quantity).toBe('2L');
      expect(result.title).toBe('Leite');
    });

    it('should handle decimal quantities', () => {
      const result = parser.parse('Carne 1,5kg');
      expect(result.quantity).toBe('1,5kg');
    });

    it('should extract multiple units', () => {
      expect(parser.parse('Arroz 5kg').quantity).toBe('5kg');
      expect(parser.parse('Água 500ml').quantity).toBe('500ml');
      expect(parser.parse('Ovos 12un').quantity).toBe('12un');
      expect(parser.parse('Pão 1dz').quantity).toBe('1dz');
    });
  });

  describe('highlights', () => {
    it('should generate highlights with correct positions', () => {
      const result = parser.parse('Leite 2L R$8,50 @Mercado', { isShoppingList: true });

      expect(result.highlights).toHaveLength(3);

      const listHighlight = result.highlights.find(h => h.type === 'list');
      expect(listHighlight?.value).toBe('@Mercado');

      const priceHighlight = result.highlights.find(h => h.type === 'price');
      expect(priceHighlight?.value).toBe('R$8,50');

      const quantityHighlight = result.highlights.find(h => h.type === 'quantity');
      expect(quantityHighlight?.value).toBe('2L');
    });

    it('should order highlights by start position', () => {
      const result = parser.parse('Leite 2L R$8,50 @Mercado', { isShoppingList: true });

      for (let i = 1; i < result.highlights.length; i++) {
        expect(result.highlights[i].start).toBeGreaterThan(result.highlights[i - 1].start);
      }
    });
  });

  describe('complex cases', () => {
    it('should parse complete shopping item', () => {
      const result = parser.parse('Leite Integral 2L R$8,50 @Mercado:Laticínios', {
        isShoppingList: true,
      });

      expect(result.title).toBe('Leite Integral');
      expect(result.listName).toBe('Mercado');
      expect(result.sectionName).toBe('Laticínios');
      expect(result.quantity).toBe('2L');
      expect(result.price).toBe(8.50);
    });

    it('should handle item without list', () => {
      const result = parser.parse('Minha ideia importante');

      expect(result.title).toBe('Minha ideia importante');
      expect(result.listName).toBeNull();
      expect(result.sectionName).toBeNull();
      expect(result.price).toBeNull();
      expect(result.quantity).toBeNull();
    });
  });
});
```

---

## 7. Performance

| Métrica | Target | Racional |
|---------|--------|----------|
| Tempo de parsing | <5ms | Feedback em tempo real durante digitação |
| Alocações | Mínimas | Evitar GC durante digitação rápida |
| Regex compiladas | Constantes | Não recompilar a cada chamada |

---

## 8. Extensibilidade

### Futuras Adições (Backlog)

- [ ] Reconhecer datas (`amanhã`, `segunda`, `15/02`)
- [ ] Reconhecer prioridades (`!`, `!!`, `!!!`)
- [ ] Reconhecer tags (`#tag`)
- [ ] Suporte a aspas para nomes com espaço (`@"Lista Longa"`)

### Pontos de Extensão

1. Adicionar novo padrão regex em constante
2. Atualizar ordem de processamento se necessário
3. Adicionar novo tipo em `Highlight['type']`
4. Atualizar testes de aceitação

---

## Conclusão

O Smart Input Parser é o componente crítico para a UX diferenciada do Listify. O contrato define:

- ✅ Interface TypeScript completa
- ✅ Regras de parsing documentadas
- ✅ Casos de borda especificados
- ✅ Testes de aceitação
- ✅ Metas de performance
- ✅ Pontos de extensibilidade

Implementação: `src/infra/services/SmartInputParserService.ts`
