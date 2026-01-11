# Especificação de Feature: Design System Completo com Atomic Design

**Feature Branch**: `001-design-system`
**Criado em**: 2026-01-09
**Status**: Draft
**Versão alvo**: v2.0
**Input**: Descrição do usuário: "Criar e estruturar um Design System totalmente novo para o Listify, com novo tema, tipografia, cores e novos componentes. Esse novo design system não deve ser inspirado no design system atual."

## Versão & Escopo *(obrigatório)*

**Inclui**:

- Sistema completo de tokens de design seguindo padrões Shadcn com tokens customizados para topbar
- Tipografia: Fira Sans (sans-serif) e Fira Code (monospace)
- Paleta de cores: Base gray chumbo com tema cyan
- Tokens Shadcn completos: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring
- Tokens customizados de topbar: topbar, topbar-foreground, topbar-primary, topbar-accent, topbar-border, topbar-ring
- Border radius: Large (radii grandes)
- Sistema de espaçamento compacto (paddings e margins reduzidos)
- Icon library: Lucide
- Suporte completo a Dark e Light theme (dark como padrão)
- Arquitetura Atomic Design (atoms, molecules, organisms, templates, pages)
- Componentes base redesenhados do zero
- Storybook para documentação visual interativa
- Sistema de animações e transições
- Coexistência com Design System legado para componentes existentes
- Testes visuais automatizados com screenshots
- CLI para scaffolding de componentes
- Theme provider com persistência e detecção de preferência do sistema

**Fora de escopo (Backlog / Próximas versões)**:

- Esta versão é completa e não deixa funcionalidades importantes para versões futuras

## Cenários do Usuário & Testes *(obrigatório)*

### User Story 1 - Configurar Sistema de Tokens Base (Priority: P1)

Como desenvolvedor, preciso de um sistema completo de tokens de design (cores Shadcn + topbar, tipografia Fira Sans/Code, espaçamento compacto, radii large), para que eu possa construir interfaces consistentes seguindo o novo design.

**Por que esta prioridade**: Tokens são a fundação do DS. Sem eles bem definidos com as especificações exatas (Fira fonts, cyan theme, gray base, large radius), não é possível criar componentes que sigam o novo visual.

**Teste Independente**: Pode ser testado importando tokens e verificando valores específicos (Fira Sans, cores cyan/gray, radius large, spacing compacto). Entrega valor imediato ao estabelecer vocabulário visual correto.

**Cenários de Aceite**:

1. **Given** tokens de tipografia, **When** importo, **Then** families.body = "Fira Sans" e families.mono = "Fira Code"
2. **Given** tokens de cor, **When** importo, **Then** tenho todos os tokens Shadcn (background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, border, input, ring)
3. **Given** tokens de cor customizados, **When** importo, **Then** tenho tokens de topbar (topbar, topbar-foreground, topbar-primary, topbar-primary-foreground, topbar-accent, topbar-accent-foreground, topbar-border, topbar-ring)
4. **Given** tokens de cor, **When** inspeciono paleta, **Then** base color é gray "chumbo" e theme color é cyan
5. **Given** tokens de radius, **When** importo, **Then** radius padrão é "large" (valores maiores que médio)
6. **Given** tokens de espaçamento, **When** importo, **Then** valores são compactos (menores que padrão Shadcn - ex: sm: 4, md: 8, lg: 12 ao invés de 8, 16, 24)

---

### User Story 2 - Criar Componentes Atoms do Design System (Priority: P1)

Como desenvolvedor, preciso de componentes atoms (Button, Input, Label, Badge, Icon) construídos do zero seguindo Atomic Design, para que eu possa compor componentes mais complexos com blocos básicos consistentes.

**Por que esta prioridade**: Atoms são os blocos fundamentais no Atomic Design. Sem atoms bem definidos, molecules e organisms não podem ser compostos corretamente.

**Teste Independente**: Pode ser testado criando showcase de atoms verificando que usam tokens corretos (Fira fonts, cyan theme, large radius, compact spacing). Entrega valor ao fornecer building blocks fundamentais.

**Cenários de Aceite**:

1. **Given** componente Button atom, **When** renderizo, **Then** usa Fira Sans, large radius, spacing compacto, cores cyan/gray e suporta variantes Shadcn (default, destructive, outline, ghost, link)
2. **Given** componente Input atom, **When** renderizo, **Then** usa Fira Sans, large radius, spacing compacto interno, border com token correto e estados (default, focus, error, disabled)
3. **Given** componente Label atom, **When** renderizo, **Then** usa Fira Sans com weight adequado e suporta estados (required, disabled)
4. **Given** componente Badge atom, **When** renderizo, **Then** usa Fira Sans, large radius, spacing compacto e variantes (default, secondary, destructive, outline)
5. **Given** componente Icon atom, **When** renderizo, **Then** usa Lucide icons library e suporta diferentes tamanhos
6. **Given** qualquer atom, **When** inspeciono código, **Then** zero valores hard-coded, apenas tokens do DS

---

### User Story 3 - Implementar Dark e Light Themes (Priority: P1)

Como usuário do app, preciso de suporte a dark theme (padrão) e light theme com alternância, para que eu possa usar o app confortavelmente em diferentes condições de iluminação, com dark mode como experiência padrão.

**Por que esta prioridade**: Themes são core da experiência visual. Dark como padrão é especificação crítica que afeta todos os componentes desde o início.

**Teste Independente**: Pode ser testado implementando theme provider com dark default, verificando que paleta cyan/gray funciona em ambos temas. Entrega valor direto ao usuário final.

**Cenários de Aceite**:

1. **Given** primeira abertura do app, **When** carrego, **Then** dark theme é aplicado por padrão (não light)
2. **Given** todos os tokens de cor, **When** inspeciono, **Then** existem valores separados para dark theme (cyan em gray chumbo escuro) e light theme (cyan em gray chumbo claro)
3. **Given** estou em dark mode, **When** ativo toggle para light, **Then** todos os componentes mudam instantaneamente com paleta mantendo cyan/gray
4. **Given** troco de tema, **When** fecho e reabro app, **Then** preferência é persistida
5. **Given** sistema operacional tem preferência light, **When** abro app pela primeira vez, **Then** app usa dark mesmo assim (dark é padrão fixo inicial)

---

### User Story 4 - Estruturar Atomic Design Architecture (Priority: P1)

Como desenvolvedor, preciso de estrutura de pastas e componentes seguindo Atomic Design (atoms/molecules/organisms/templates/pages), para que o código seja organizado hierarquicamente e componentes sejam compostos de forma previsível.

**Por que esta prioridade**: Atomic Design é especificação arquitetural core. Definir estrutura no início evita refatorações grandes e garante composição correta.

**Teste Independente**: Pode ser testado verificando estrutura de pastas e que componentes seguem hierarquia (molecules usam atoms, organisms usam molecules, etc). Entrega valor ao organizar codebase.

**Cenários de Aceite**:

1. **Given** estrutura do DS, **When** inspeciono pastas, **Then** existe src/design-system/atoms, /molecules, /organisms, /templates, /pages
2. **Given** componentes molecules, **When** inspeciono imports, **Then** usam apenas atoms (não podem importar organisms)
3. **Given** componentes organisms, **When** inspeciono imports, **Then** usam atoms e molecules (não podem importar templates/pages)
4. **Given** templates, **When** inspeciono, **Then** compõem organisms/molecules/atoms sem lógica de dados
5. **Given** pages, **When** inspeciono, **Then** usam templates e injetam dados/lógica real
6. **Given** documentação, **When** leio sobre Atomic Design, **Then** há guidelines claros de quando criar atom vs molecule vs organism

---

### User Story 5 - Configurar Storybook para Documentação Visual (Priority: P1)

Como desenvolvedor, preciso de Storybook configurado exibindo atoms, molecules e organisms com todas variantes, para que eu possa desenvolver componentes em isolamento e validar visualmente o novo design.

**Por que esta prioridade**: Storybook é essencial para desenvolver e validar novo DS. Deve ser configurado cedo para facilitar desenvolvimento iterativo dos componentes redesenhados.

**Teste Independente**: Pode ser testado acessando Storybook e verificando que todos os níveis Atomic Design estão documentados com stories. Entrega valor ao facilitar desenvolvimento visual.

**Cenários de Aceite**:

1. **Given** Storybook rodando, **When** navego, **Then** vejo seções separadas: Atoms, Molecules, Organisms, Templates
2. **Given** qualquer componente, **When** visualizo no Storybook, **Then** vejo Fira Sans aplicada, large radius, spacing compacto, cores cyan/gray
3. **Given** Storybook toolbar, **When** alterno theme, **Then** todos os componentes mudam entre dark (padrão) e light mantendo paleta
4. **Given** componente com variantes, **When** uso controles, **Then** posso modificar props e ver mudanças em tempo real
5. **Given** stories de atoms, **When** visualizo, **Then** cada atom tem stories mostrando todas as variantes possíveis

---

### User Story 6 - Estabelecer Coexistência entre Design Systems (Priority: P1)

Como desenvolvedor, preciso que o novo DS coexista com o DS legado de forma organizada, para que novos componentes possam usar o novo visual (Fira fonts, cyan/gray, large radius, spacing compacto) enquanto componentes existentes continuam funcionando sem breaking changes.

**Por que esta prioridade**: Coexistência controlada é essencial para permitir adoção gradual do novo design sem quebrar funcionalidades existentes. Permite desenvolvimento incremental de novos recursos com o novo visual.

**Teste Independente**: Pode ser testado verificando que ambos DS funcionam simultaneamente, imports estão corretos, e não há conflitos. Entrega valor ao estabelecer base para desenvolvimento futuro.

**Cenários de Aceite**:

1. **Given** estrutura do projeto, **When** audito, **Then** existe `src/legacy-design-system/` (DS antigo) e `src/design-system/` (DS novo) coexistindo
2. **Given** componentes existentes, **When** inspeciono imports, **Then** usam `@legacy-design-system/*` e funcionam normalmente
3. **Given** novos componentes criados, **When** uso CLI do novo DS, **Then** automaticamente importam de `@design-system/*`
4. **Given** documentação, **When** leio guidelines, **Then** há instruções claras sobre quando usar DS legado vs novo DS
5. **Given** ambos DS ativos, **When** executo testes, **Then** não há conflitos de estilos ou nomes entre eles

---

### User Story 7 - Criar Molecules e Organisms (Priority: P2)

Como desenvolvedor, preciso de componentes molecules (ex: FormField = Label + Input, SearchBar) e organisms (ex: Navbar com topbar tokens, ShoppingListCard) compostos de atoms, para que interfaces complexas possam ser montadas seguindo Atomic Design.

**Por que esta prioridade**: Molecules e organisms vêm depois de atoms estarem sólidos. São essenciais para compor UIs reais mas dependem de atoms funcionais.

**Teste Independente**: Pode ser testado criando molecules/organisms e verificando que compõem atoms corretamente seguindo hierarquia. Entrega valor ao fornecer componentes de nível médio/alto.

**Cenários de Aceite**:

1. **Given** molecule FormField, **When** renderizo, **Then** compõe Label atom + Input atom com spacing compacto entre eles
2. **Given** organism Navbar, **When** renderizo, **Then** usa tokens customizados de topbar (topbar, topbar-foreground, topbar-primary, topbar-accent, topbar-border, topbar-ring)
3. **Given** qualquer molecule, **When** inspeciono imports, **Then** importa apenas atoms (não outros molecules ou organisms)
4. **Given** qualquer organism, **When** inspeciono imports, **Then** importa atoms e molecules (mantém hierarquia Atomic Design)
5. **Given** organism ShoppingListCard, **When** renderizo, **Then** usa Card atom, Badge atoms, Icon atoms compostos com large radius e spacing compacto

---

### User Story 8 - Implementar Sistema de Animações e Transições (Priority: P2)

Como usuário do app, preciso de animações e transições suaves entre estados e navegação, para que experiência seja fluida e profissional com novo visual.

**Por que esta prioridade**: Animações melhoram UX mas devem vir depois de estrutura base (tokens, atoms, themes) estar sólida.

**Teste Independente**: Pode ser testado criando biblioteca de animações reutilizáveis e aplicando em componentes-chave. Entrega valor ao melhorar UX percebida.

**Cenários de Aceite**:

1. **Given** biblioteca de tokens de animação, **When** importo, **Then** tenho durações (fast, normal, slow) e easing curves padronizados
2. **Given** Button atom pressionado, **When** usuário interage, **Then** há feedback visual animado consistente
3. **Given** modal/sheet abre, **When** aparece, **Then** há animação de entrada suave (slide + fade)
4. **Given** navegação entre telas, **When** transita, **Then** há animação performática (60fps)
5. **Given** preferência reduced motion, **When** usuário ativa, **Then** animações são reduzidas respeitando acessibilidade

---

### User Story 9 - Criar CLI para Scaffolding de Componentes (Priority: P3)

Como desenvolvedor, preciso de CLI que gere boilerplate de componentes seguindo Atomic Design e padrões do DS, para que eu crie novos componentes rapidamente sem copiar código.

**Por que esta prioridade**: CLI é facilitador de produtividade mas não crítico. Pode vir quando padrões estiverem maduros.

**Teste Independente**: Pode ser testado executando comandos CLI e verificando código gerado segue padrões (Atomic Design, tokens, estrutura). Entrega valor ao acelerar desenvolvimento futuro.

**Cenários de Aceite**:

1. **Given** comando `ds generate atom MyButton`, **When** executo, **Then** cria arquivos em /atoms seguindo estrutura padrão
2. **Given** comando `ds generate molecule MyForm`, **When** executo, **Then** cria arquivos em /molecules com imports de atoms
3. **Given** qualquer componente gerado, **When** inspeciono, **Then** usa apenas tokens, tem TypeScript completo, segue conventions
4. **Given** comando com flag `--with-story`, **When** gero componente, **Then** também cria arquivo .stories.tsx para Storybook
5. **Given** CLI help, **When** executo `ds --help`, **Then** há documentação de comandos (generate atom/molecule/organism, add, list)

---

### User Story 10 - Implementar Testes Visuais com Screenshots (Priority: P3)

Como desenvolvedor, preciso de testes visuais automatizados capturando screenshots de componentes, para prevenir regressões visuais não intencionais no novo design.

**Por que esta prioridade**: Testes visuais são valiosos para manutenção mas podem vir depois da base estar estável. Evitam quebras visuais acidentais.

**Teste Independente**: Pode ser testado configurando screenshot testing e criando baselines. Entrega valor ao prevenir regressões visuais.

**Cenários de Aceite**:

1. **Given** suite de testes visuais, **When** executo, **Then** screenshots são capturados de atoms/molecules/organisms em todas variantes
2. **Given** modifico estilos, **When** rodo testes, **Then** diferenças são detectadas com diff visual
3. **Given** mudanças intencionais, **When** aprovo, **Then** baselines são atualizadas
4. **Given** testes visuais, **When** executo, **Then** cobrem dark theme (padrão), light theme e diferentes viewports
5. **Given** screenshots, **When** visualizo, **Then** vejo Fira fonts, large radius, spacing compacto, cores cyan/gray aplicados corretamente

---

### User Story 11 - Documentar Design System (Priority: P2)

Como desenvolvedor, preciso de documentação completa (README.md) sobre tokens, Atomic Design, componentes e guidelines, para que eu possa adotar DS rapidamente e entender decisões de design (Fira fonts, cyan theme, etc).

**Por que esta prioridade**: Documentação garante adoção consistente mas vem depois de implementação estar funcional.

**Teste Independente**: Pode ser testado seguindo documentação do zero para criar componente. Entrega valor ao acelerar onboarding.

**Cenários de Aceite**:

1. **Given** documentação de tokens, **When** leio, **Then** há explicação de por que Fira Sans/Code, cyan theme, gray base, large radius, spacing compacto
2. **Given** documentação Atomic Design, **When** leio, **Then** há guidelines claros de quando criar atom vs molecule vs organism
3. **Given** documentação de topbar tokens, **When** leio, **Then** há exemplos de uso dos tokens customizados (topbar-*)
4. **Given** documentação de themes, **When** leio, **Then** há explicação de dark como padrão e como paleta cyan/gray funciona em ambos temas
5. **Given** novo desenvolvedor, **When** lê documentação, **Then** consegue usar DS sem consultar desenvolvedores existentes

---

### Edge Cases

- O que acontece se desenvolvedor tentar usar valores hard-coded ao invés de tokens? (Lint rules devem alertar)
- Como garantir que spacing compacto não quebra acessibilidade (touch targets mínimos)? (Documentação deve guiar valores mínimos seguros)
- O que acontece se componente precisa usar font diferente de Fira? (Documentação deve justificar exceções raras como números tabulares)
- Como garantir que large radius funciona em componentes pequenos? (Tokens devem ter radius-sm para casos específicos)
- Como lidar com Lucide icons faltando ícone específico? (Documentação deve guiar sobre criar custom icons no mesmo estilo)
- O que acontece se topbar tokens não forem suficientes para customização? (Estrutura deve permitir extensão com novos tokens semânticos)
- Como garantir que dark padrão não confunde usuários que preferem light? (UI deve ter toggle visível de theme)

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: Sistema MUST fornecer tokens de tipografia com families.body = "Fira Sans" e families.mono = "Fira Code"
- **FR-002**: Sistema MUST fornecer todos os tokens de cor Shadcn: background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, border, input, ring
- **FR-003**: Sistema MUST fornecer tokens customizados de topbar: topbar, topbar-foreground, topbar-primary, topbar-primary-foreground, topbar-accent, topbar-accent-foreground, topbar-border, topbar-ring
- **FR-004**: Sistema MUST usar base color gray "chumbo" e theme color cyan em toda paleta
- **FR-005**: Sistema MUST fornecer border radius com valores "large" (maiores que médio)
- **FR-006**: Sistema MUST fornecer sistema de espaçamento compacto (valores menores que padrão Shadcn)
- **FR-007**: Sistema MUST integrar Lucide como icon library oficial
- **FR-008**: Sistema MUST fornecer dark theme e light theme com dark como padrão inicial
- **FR-009**: Sistema MUST estruturar componentes seguindo Atomic Design: atoms, molecules, organisms, templates, pages
- **FR-010**: Todos os atoms MUST usar exclusivamente tokens do DS (zero hard-coded values)
- **FR-011**: Molecules MUST importar apenas atoms (não outros molecules ou organisms)
- **FR-012**: Organisms MUST importar atoms e molecules (mantendo hierarquia Atomic Design)
- **FR-013**: Templates MUST compor organisms/molecules/atoms sem lógica de dados
- **FR-014**: Pages MUST usar templates e injetar dados/lógica real
- **FR-015**: Sistema MUST fornecer theme provider com suporte a dark/light switching
- **FR-016**: Theme provider MUST persistir preferência do usuário
- **FR-017**: Dark theme MUST ser aplicado por padrão na primeira abertura do app
- **FR-018**: Sistema MUST fornecer Storybook com seções separadas para Atoms, Molecules, Organisms, Templates
- **FR-019**: Storybook MUST suportar theme switching via toolbar
- **FR-020**: Sistema MUST incluir biblioteca de tokens de animação (durações, easing curves)
- **FR-021**: Sistema MUST fornecer CLI com comandos: generate atom/molecule/organism, add, list
- **FR-022**: CLI MUST gerar componentes com estrutura correta para nível Atomic Design
- **FR-023**: Sistema MUST incluir testes visuais automatizados capturando screenshots
- **FR-024**: Testes visuais MUST cobrir dark theme, light theme e diferentes viewports
- **FR-025**: Sistema MUST incluir documentação README.md completa sobre tokens, Atomic Design e guidelines
- **FR-026**: Sistema MUST estabelecer coexistência entre DS legado (`@legacy-design-system/*`) e novo DS (`@design-system/*`)
- **FR-027**: Sistema MUST fornecer documentação clara sobre quando usar DS legado vs novo DS

### Entidades-chave

- **Design Tokens**: Valores primitivos (Fira fonts, cyan/gray colors, large radius, compact spacing) que formam vocabulário visual
- **Theme**: Conjunto de valores de tokens para dark (padrão) ou light mode mantendo paleta cyan/gray
- **Atom**: Componente básico indivisível (Button, Input, Label, Badge, Icon) usando apenas tokens
- **Molecule**: Componente composto de atoms (FormField = Label + Input, SearchBar)
- **Organism**: Componente complexo composto de molecules e atoms (Navbar com topbar tokens, ShoppingListCard)
- **Template**: Composição de organisms/molecules/atoms sem lógica de dados (layout structures)
- **Page**: Template + dados/lógica real do app

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: 100% dos tokens de tipografia usam Fira Sans (body) e Fira Code (mono) - verificável via grep
- **SC-002**: 100% das cores seguem paleta cyan theme com gray "chumbo" base - verificável visualmente
- **SC-003**: 100% dos componentes usam large radius (não médio ou pequeno) - verificável via inspeção visual
- **SC-004**: 100% dos componentes usam spacing compacto (valores menores que Shadcn padrão) - verificável via medições
- **SC-005**: 100% dos ícones vêm de Lucide library - verificável via grep de imports
- **SC-006**: Dark theme é aplicado por padrão em 100% das primeiras aberturas do app
- **SC-007**: 100% dos componentes estão organizados em pastas atoms/molecules/organisms/templates/pages
- **SC-008**: 0% dos molecules importam outros molecules ou organisms (hierarquia respeitada) - verificável via lint
- **SC-009**: 0% dos componentes do novo DS contêm valores hard-coded - verificável via lint
- **SC-010**: 100% dos componentes base (atoms/molecules/organisms) estão documentados no Storybook
- **SC-011**: DS legado e novo DS coexistem sem conflitos de imports ou estilos - verificável via testes
- **SC-012**: Path aliases `@legacy-design-system/*` e `@design-system/*` funcionam corretamente - verificável via build
- **SC-013**: CLI gera componentes que passam em 100% das lint rules do DS
- **SC-014**: Testes visuais cobrem 100% dos atoms e 90%+ molecules/organisms em ambos temas
- **SC-015**: Desenvolvedores conseguem criar novo componente usando apenas documentação (sem consultar código-fonte)

## Premissas e Dependências

### Premissas

- Fira Sans e Fira Code estão disponíveis como Google Fonts ou podem ser self-hosted
- Lucide icons library tem todos os ícones necessários para o app
- Atomic Design é metodologia conhecida pelo time
- Shadcn tokens são padrão aceito mesmo em React Native (adaptações necessárias)
- Dark theme como padrão é decisão de produto validada
- Spacing compacto não viola guidelines de acessibilidade (touch targets mínimos mantidos)
- Cyan e gray "chumbo" têm contraste suficiente para WCAG AA em ambos temas

### Dependências

- React Native (já instalado)
- TypeScript (já configurado)
- Expo (para fonts customizadas)
- Lucide React Native (ou react-native-svg para ícones)
- Storybook React Native
- ESLint com regras customizadas para enforcar uso de tokens e hierarquia Atomic Design
- Ferramenta de screenshot testing (Playwright, Chromatic, ou similar)
- AsyncStorage ou similar para persistir preferência de theme

## Perguntas Abertas

Nenhuma no momento. A especificação possui detalhes suficientes:
- Tipografia definida: Fira Sans e Fira Code
- Cores definidas: Gray chumbo base, Cyan theme
- Tokens Shadcn completos listados
- Tokens customizados topbar listados
- Radius: Large
- Spacing: Compacto
- Icons: Lucide
- Themes: Dark (padrão) e Light
- Arquitetura: Atomic Design
