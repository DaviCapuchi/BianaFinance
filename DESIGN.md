# Design System: Harmonia Finanças (Biana Finance)

Especificação visual e técnica para o organizador de finanças pessoais **Harmonia Finanças** (Biana Finance), fundamentada nas telas e tokens do Stitch Canvas (`Warm Financial Wellbeing`) e no diagrama de arquitetura de interface (`DesignExcalidraw.md`).

---

## 1. Visual Theme & Atmosphere

O **Harmonia Finanças** adota o movimento **Contemporary Warm Minimalism com Tactile Organic Softness**. 

Em contraposição às interfaces bancárias corporativas frias (azuis monocromáticos) ou neons agressivos de fintechs especulativas, a identidade visual é enraizada no bem-estar, na tranquilidade doméstica e no acolhimento emocional. 

- **Atmosfera & Temperatura:** Superfícies claras e aquecidas em linho/creme (`#FFF8F6` / `#FAF7F2`), tipografia em tom de café espresso torrado profundo (`#2A170F`), acentos energéticos em terracota queimada (`#9A4100` / `#D96B27`) para decisões ativas e verde floresta botânico (`#3B6750` / `#2E5A44`) para receitas, poupança e prosperidade estável.
- **Materialidade & Profundidade:** Texturas táteis com bordas suaves e sombras ambientais difusas tingidas com o tom do espresso (`rgba(44, 24, 16, 0.05)`). Sombras pretas puras (`#000000`) são expressamente proibidas.
- **Voz do Produto:** "Cuidar do seu dinheiro também é cuidar de quem você ama." A interface transmite serenidade, clareza e autonomia sem sobrecarregar o usuário com estresse métrico.

---

## 2. Color Palette & Roles

Tokens canônicos compatíveis com Tailwind CSS v4 (`@import "tailwindcss";`) e o tema Stitch Canvas:

### Primary Foundation (Superfícies & Fundos)
- **Canvas / Root Background (`#FFF8F6` / `#FAF7F2`):** Fundo primário suave e acolhedor para a viewport e páginas de autenticação.
- **Surface Lowest / Card Base (`#FFFFFF`):** Branco puro para superfícies de cartões em elevação, cartões de KPI e modais.
- **Surface Low (`#FFF1EC`):** Fundo sutil para estados de hover em botões, cartões de transação aninhados e containers neutros secundários.
- **Surface Container (`#FFE9E2`):** Base para toggles de período (Semanal / Mensal / Anual) e barras de progresso não preenchidas.
- **Surface High (`#FFE2D8`):** Destaque para badges de categoria e fundos de ícones de alerta/atenção.
- **Surface Highest (`#FFDBCE`):** Acento tonal de apoio para sobreposições e glow difuso em cards.

### Accent & Interactive
- **Primary Terracotta (`#D96B27` / `#9A4100`):** O catalisador de ação. Utilizado em botões de ação principal (*Nova Transação*, *Entrar na Conta*, *Criar Minha Conta*), foco de inputs e marcos financeiros.
- **Primary Hover (`#BD5611`):** Estado de interação com clique ou foco no botão principal.
- **Forest Green (`#2E5A44` / `#3B6750`):** O indicador de prosperidade e saldo positivo. Utilizado no valor de receitas (`+ R$ 6.000,00`), tags de superávit e ações de adicionar saldo/poupança.
- **Forest Container (`#BDEED0`):** Fundo suave para pílulas de status positivo (`+12% vs set`, `100% recebido`).
- **Warm Caramel / Amber (`#D49B4F` / `#805208`):** Para metas financeiras, investimentos, poupança e reservas de emergência.

### Typography Hierarchy (Contraste & Legibilidade)
- **Espresso Dark / On-Surface (`#2A170F` / `#2C1810`):** Cor primária de leitura de textos, títulos principais, valores numéricos de despesa e cabeçalhos de tabela.
- **Espresso Medium / On-Surface-Variant (`#574238`):** Subtítulos de boas-vindas ("Aqui está o resumo da sua saúde financeira este mês"), labels descritivos e textos de apoio.
- **Outline & Muted (`#8A7267` / `#8D766C`):** Placeholders, metadados secundários, timestamps, bordas de inputs inativos e divisórias sutis.
- **Outline Hairline (`rgba(44, 24, 16, 0.06)` / `#EFE8DE`):** Linha de contorno padrão (1px) de cartões e divisores de lista.

### Categorias de Gastos (Donut Chart & Badges)
- **Moradia:** Terracota (`#D96B27`)
- **Alimentação:** Verde Floresta (`#2E5A44`)
- **Transporte:** Caramelo Dourado (`#D49B4F`)
- **Lazer & Cultura:** Terracota Claro / Pêssego Tonal (`#E28743`)
- **Saúde & Educação:** Sálvia Suave (`#416D56`)

---

## 3. Typography Rules

Família tipográfica principal: **Plus Jakarta Sans** (com fallback para `Inter, sans-serif`). Para valores monetários e tabelas numéricas: suporte a variantes tabulares (`font-feature-settings: "tnum"`).

| Nível | Família | Tamanho / Line-Height | Peso | Tracking | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline XL** | Plus Jakarta Sans | 40px / 48px | 700 (Bold) | `-0.02em` | Valores de Saldo Total e KPIs principais |
| **Headline LG** | Plus Jakarta Sans | 32px / 40px | 700 (Bold) | `-0.015em` | Título do Dashboard ("Olá, Davi 👋"), Títulos Auth |
| **Headline MD** | Plus Jakarta Sans | 24px / 32px | 600 (SemiBold)| `-0.01em` | Títulos de seções nos Cards e Modais |
| **Headline SM** | Plus Jakarta Sans | 20px / 28px | 600 (SemiBold)| `normal` | Títulos de Gráficos ("Evolução das Finanças") |
| **Body LG** | Plus Jakarta Sans | 18px / 28px | 400 (Regular) | `normal` | Frases de impacto em onboarding e autenticação |
| **Body MD** | Plus Jakarta Sans | 15px / 24px | 400 (Regular) | `normal` | Textos descritivos e parágrafos |
| **Body SM** | Plus Jakarta Sans | 13px / 20px | 400 / 500 | `normal` | Descrições secundárias, subtítulos de cartões |
| **Label LG** | Plus Jakarta Sans | 15px / 20px | 600 (SemiBold)| `+0.01em` | Textos de Botões e Itens da Barra de Navegação |
| **Label MD** | Plus Jakarta Sans | 13px / 18px | 600 (SemiBold)| `+0.01em` | Títulos de Cartão KPI em caixa alta e Dropdowns |
| **Label SM** | Plus Jakarta Sans | 11px / 16px | 600 (SemiBold)| `+0.03em` | Badges de status, pílulas de porcentagem e tooltips |

---

## 4. Component Stylings

### 4.1 Buttons & Controls
- **Primary Action (Terracotta):** Fundo `#D96B27`, texto `#FFFFFF`, cantos `rounded-xl` (12px), sombra `0 8px 20px -4px rgba(154, 65, 0, 0.35)`. No hover: transição para `#BD5611` e active: `scale-[0.98]`.
- **Secondary Action (Surface Pill / Outline):** Fundo `#FFFFFF`, borda de 1px `#EFE8DE`, texto `#2A170F`, sombra `0 2px 8px rgba(42, 23, 15, 0.05)`. Utilizado em *Exportar* e *Seletor de Período*.
- **Period Filter Toggle:** Container pílula em `#FFE9E2`, botões internos `rounded-lg` com estado ativo em `#FFFFFF` + sombra leve.

### 4.2 KPI Summary Cards (Tríade Financeira)
Definidos a partir do wireframe `DesignExcalidraw.md` (`entradas`, `saídas`, `saldo/saída x entrada`):
- **Layout:** Grid de 3 colunas em desktop, coluna única em mobile.
- **Card 1 - Saldo Atual:** Superfície `#FFFFFF`, borda `1px solid rgba(44, 24, 16, 0.06)`, ícone de carteira em container terracota claro, valor em Headline XL, badge inferior de tendência (`+12% vs set`) e metadados de conta bancária (`Conta Corrente • Nubank`).
- **Card 2 - Receitas (Mês):** Acentos em Verde Floresta (`#2E5A44`), ícone de seta de entrada (`south_west`), valor em verde (`+ R$ 6.000,00`), barra de progresso com indicador de meta (`100% recebido`).
- **Card 3 - Despesas (Mês):** Acentos em Terracota (`#D96B27`), ícone de seta de saída (`north_east`), valor com prefixo negativo (`- R$ 1.750,00`), porcentagem comprometida (`29.1% da renda`) e valor poupado líquido.

### 4.3 Sidebar & User Profile (`DesignExcalidraw.md`)
- **Navegação Fixa:** Barra lateral vertical em `bg-surface-container-lowest` ou `bg-surface` com separador suave à direita.
- **Logotipo:** Harmonia Finanças com ícone de logo orgânico da marca.
- **Itens de Menu:**
  - `grid_view` Dashboard (Ativo com acento Terracota e fundo suave)
  - `sync_alt` Transações
  - `query_stats` Relatórios
  - `savings` Metas & Orçamentos
  - `settings` Configurações
- **Rodapé da Sidebar (User Anchor):** Foto do usuário (`PHOTO USER`), Nome ("Davi"), e-mail institucional/pessoal e botão de atalho para configurações.

### 4.4 Visualizações & Gráficos
- **Evolução das Finanças (Saídas x Entradas):** Card de 8 colunas (largura de ~66%). Gráfico de linhas/área com curvas suaves (*Bézier*), gradiente verde suave para receitas e linha contrastante para despesas, com tooltip flutuante animado (*Pico Salarial*).
- **Gastos por Categoria (Veja Aonde Seu Dinheiro Vai):** Card de 4 colunas (largura de ~34%). Gráfico em anel (*Donut*) com espessura generosa, valor total centralizado e lista de categorias com porcentagem e valores em reais.

### 4.5 Transações Recentes
- Linhas com espaçamento ergonômico, ícone circular da categoria (40px) em fundo suave, descrição com data/horário e valor destacado (+ em verde, - em espresso).

### 4.6 Formulários & Autenticação (Sign In / Sign Up)
- **Input Fields:** Altura mínima de 44px, cantos `rounded-xl` (12px), fundo `#FFFFFF`, borda de 1.5px `#E8DFC8`. No foco: anel de destaque em terracota `ring-2 ring-primary/20 border-primary`.
- **Labels:** Posicionados acima do campo com peso 600 em cor `#2A170F`.
- **Termos & Lembrar de Mim:** Checkbox personalizado `rounded-md` preenchido em `#D96B27` quando marcado.

---

## 5. Layout Principles & Grid Architecture

- **Baseline Grid:** Sistema espacial métrico de 8px com micro-ajustes de 4px (`space-xs: 4px`, `space-sm: 8px`, `space-md: 16px`, `space-lg: 24px`, `space-xl: 40px`).
- **Container Max-Width:** Capped em `1280px` com margens laterais de `3rem` (48px) em desktop para manter o conforto de leitura.
- **Breakpoints:**
  - `Mobile (< 768px)`: 4 colunas fluidas, empilhamento vertical único de KPI cards, barra de navegação retrátil ou inferior.
  - `Tablet (768px - 1024px)`: 8 colunas fluidas, 2 colunas para métricas e transações.
  - `Desktop (> 1024px)`: 12 colunas estruturadas, layout 8:4 para gráficos e métricas analíticas.

---

## 6. Stitch Generation Notes

Diretrizes para síntese de novas telas e componentes via Stitch Canvas (`stitch generate screen`):

- **Atmosphere Keywords:** `Warm financial wellbeing, contemporary warm minimalism, tactile organic cards, soft cream background, terracotta primary actions, deep forest green balances, warm espresso typography, human-centered personal finance`.
- **Prompt Patterns:**
  - *"Dashboard financeiro com layout de 12 colunas, 3 cartões de resumo (Saldo Atual, Receitas e Despesas), gráfico de evolução semanal com gradiente botânico e pílula de pico salarial, e anel de despesas por categoria em tons quentes."*
  - *"Tela de cadastro com cartão centralizado de cantos arredondados (24px), inputs em creme com foco em terracota, logo Harmonia Finanças no topo e copy acolhedor 'Cuidar do seu dinheiro também é cuidar de quem você ama'."*
  - *"Lista de transações com cartões brancos táteis, badges em pílulas com porcentagem, valores monetários formatados em Real (R$) e ícones arredondados de 40px em tom caramelo."*
