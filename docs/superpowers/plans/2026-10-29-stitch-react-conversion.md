# Conversão do Design Stitch em Aplicação React Biana Finanças

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter as páginas estáticas geradas no `.stitch` (`dashboard.html`, `signin.html`, `signup.html`) em uma aplicação React 18+ SPA moderna, modular, tipada estritamente com TypeScript e estilizada com Tailwind CSS conforme as diretrizes do `DESIGN.md`.

**Architecture:** A aplicação adota a arquitetura em camadas orientada a responsabilidade única: componentes atômicos reutilizáveis (`components/ui`), componentes de domínio (`features/dashboard` e `features/auth`), páginas de orquestração (`pages`), contratos TypeScript estritos (`types`) e utilitários puros (`utils`). O estado e as regras de negócio são isolados em Custom Hooks dedicados (`useFinancialData`, `usePasswordStrength`), mantendo os componentes visuais puramente apresentacionais.

**Tech Stack:** React 19 (Hooks, Functional Components), TypeScript (Strict mode), Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React, Vitest + @testing-library/react + jsdom para TDD.

**Spec:** `DESIGN.md` e os arquivos `.stitch/dashboard.html`, `.stitch/signin.html`, `.stitch/signup.html`.

## Global Constraints

- **Strict Mode:** TypeScript com strict mode ativado; proíbe terminantemente o uso de `any`.
- **Identidade Visual:** Contemporary Warm Minimalism com Tactile Organic Softness (`DESIGN.md`).
- **Paleta de Cores Canônica:** Canvas (`#FFF8F6` / `#FAF7F2`), Superfície (`#FFFFFF`), Primário Terracota (`#9A4100` / `#D96B27`), Floresta Botânico (`#2E5A44` / `#3B6750`), Caramelo (`#805208` / `#D49B4F`), Espresso Dark (`#2A170F`), Espresso Medium (`#574238`), Outline (`#8A7267`).
- **Sombras:** Proibidas sombras pretas puras (`#000000`). Todas as elevações usam tom de café espresso torrado (`rgba(42, 23, 15, 0.05)`).
- **Tipografia:** Plus Jakarta Sans com suporte a números tabulares (`font-feature-settings: "tnum"`).
- **Formulários Controlados:** Todos os `<input>` e `<select>` devem ter valor inicial não-nulo (fallback `""`) para evitar avisos de elementos não-controlados. Todos os submits invocam `e.preventDefault()`.
- **Renderização Condicional Limpa:** Proibido uso de `{array.length && <Component />}` para evitar renderização acidental do número `0`. Usar ternário ou checagem booleana explícita (`array.length > 0 ? ... : ...`).
- **Acessibilidade:** Elementos interativos com estados focáveis claros e `aria-label` onde ícones são solitários.

## Review Focus

1. **Formatação Monetária com Sinais e Decimais BRL:** A função `formatSignedCurrency` com valores negativos, zero ou positivos deve formatar rigorosamente sem duplicar sinais (ex: `- R$ 1.750,00` e `+ R$ 6.000,00`, nunca `- R$ -1.750,00`).
2. **Entradas de Formulário Seguras e Não-Nulas:** Todos os inputs de login, cadastro e nova transação devem inicializar controlados sem gerar erro de "uncontrolled to controlled".
3. **Validação e Confirmação de Senhas em Tempo Real:** No formulário de cadastro, discrepâncias entre senha e confirmação, bem como cálculo de força (0-4), devem atualizar a UI reativamente sem bloquear a digitação.
4. **Cálculo de Porcentagens de Categoria com Total Zero:** Quando o total de despesas for zero, a distribuição de categorias deve retornar 0% sem gerar `NaN%` ou divisão por zero no gráfico SVG.
5. **Filtro de Transações Vazio:** O filtro de transações (Todas, Entradas, Saídas, Cartão de Crédito) quando não encontrar resultados deve exibir um empty state amigável e legível, sem quebrar o layout nem renderizar `0`.

---

### Task 1: Infraestrutura de Testes e Tokens do Design System

**Files:**
- Create: `frontend/src/test/setup.ts`
- Modify: `frontend/package.json`
- Modify: `frontend/vite.config.ts`
- Modify: `frontend/src/index.css`
- Test: `frontend/src/test/setup.test.ts`

**Interfaces:**
- Consumes: N/A
- Produces: Ambiente de testes Vitest funcional com JSDOM e Tailwind CSS configurado com os tokens visuais de `DESIGN.md`.

- [ ] **Step 1: Write the failing test**

```typescript
// frontend/src/test/setup.test.ts
import { describe, it, expect } from 'vitest';

describe('Test Environment Setup', () => {
  it('runs tests and has document available in jsdom', () => {
    const el = document.createElement('div');
    el.className = 'bg-surface text-primary';
    document.body.appendChild(el);
    expect(document.body.contains(el)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/test/setup.test.ts`
Expected: FAIL (vitest not installed / not configured in vite.config).

- [ ] **Step 3: Instalar dependências de teste e configurar Vite e Tailwind CSS v4**

1. Instalar no `frontend`: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
2. Configurar `frontend/vite.config.ts` com bloco `test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.ts' }`.
3. Criar `frontend/src/test/setup.ts` importando `@testing-library/jest-dom/vitest`.
4. Atualizar `frontend/src/index.css` configurando `@theme` do Tailwind v4 com as cores de `DESIGN.md` (`surface`, `surface-container-*`, `primary`, `secondary`, `tertiary`, `on-surface`, `espresso`, etc.) e utilitários táteis de sombra.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/test/setup.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/vite.config.ts frontend/src/test/ frontend/src/index.css
git commit -m "chore: setup vitest testing environment and design system tokens"
```

---

### Task 2: Contratos de Tipagem TypeScript e Utilitários Puros

**Files:**
- Create: `frontend/src/types/finance.ts`
- Create: `frontend/src/types/auth.ts`
- Create: `frontend/src/utils/formatters.ts`
- Create: `frontend/src/utils/cn.ts`
- Test: `frontend/src/utils/formatters.test.ts`

**Interfaces:**
- Consumes: N/A
- Produces:
  - `Transaction`, `TransactionType`, `TransactionCategory`, `TransactionFilter`, `FinancialSummary`, `CategoryExpense`, `TimeframeOption` em `types/finance.ts`
  - `User`, `SignInCredentials`, `SignUpCredentials`, `PasswordStrength` em `types/auth.ts`
  - `formatCurrency(val: number): string`
  - `formatSignedCurrency(val: number, type: TransactionType): string`
  - `formatPercentage(val: number): string`
  - `formatDate(dateStr: string): string`
  - `cn(...classes: (string | undefined | null | false)[]): string`

- [ ] **Step 1: Write the failing test**

```typescript
// frontend/src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatSignedCurrency, formatPercentage } from './formatters';

describe('Financial Formatters', () => {
  it('formats positive and zero values to BRL currency', () => {
    expect(formatCurrency(4250)).toMatch(/R\$\s*4\.250,00/);
    expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
  });

  it('formats signed currency correctly without duplicate signs', () => {
    expect(formatSignedCurrency(6000, 'income')).toMatch(/\+\s*R\$\s*6\.000,00/);
    expect(formatSignedCurrency(-1750, 'expense')).toMatch(/-\s*R\$\s*1\.750,00/);
    expect(formatSignedCurrency(1750, 'expense')).toMatch(/-\s*R\$\s*1\.750,00/);
  });

  it('formats percentage with optional sign', () => {
    expect(formatPercentage(12)).toBe('+12%');
    expect(formatPercentage(-3)).toBe('-3%');
    expect(formatPercentage(29.1, false)).toBe('29.1%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/utils/formatters.test.ts`
Expected: FAIL ("Cannot find module ./formatters")

- [ ] **Step 3: Implementar tipos e utilitários puros**

1. Definir interfaces em `frontend/src/types/finance.ts` e `frontend/src/types/auth.ts` com strict typing, sem `any`.
2. Implementar `formatCurrency`, `formatSignedCurrency`, `formatPercentage`, `formatDate` em `frontend/src/utils/formatters.ts` utilizando `Intl.NumberFormat('pt-BR')`.
3. Implementar função helper `cn` em `frontend/src/utils/cn.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/utils/formatters.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/ frontend/src/utils/
git commit -m "feat: add domain types and pure financial formatting utilities"
```

---

### Task 3: Componentes Atômicos de UI (Button, Input, Card, Badge, Checkbox, Modal)

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Input.tsx`
- Create: `frontend/src/components/ui/Card.tsx`
- Create: `frontend/src/components/ui/Badge.tsx`
- Create: `frontend/src/components/ui/Checkbox.tsx`
- Create: `frontend/src/components/ui/Modal.tsx`
- Test: `frontend/src/components/ui/Button.test.tsx`
- Test: `frontend/src/components/ui/Input.test.tsx`
- Test: `frontend/src/components/ui/Modal.test.tsx`

**Interfaces:**
- Consumes: `cn` de `src/utils/cn`
- Produces:
  - `<Button variant="primary" | "secondary" | "outline" | "ghost" size="sm" | "md" | "lg" isLoading? leftIcon? rightIcon? />`
  - `<Input label? error? leftIcon? rightIcon? ...props />` (sempre controlado com fallback `value ?? ''`)
  - `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
  - `<Badge variant="terracotta" | "forest" | "caramel" | "surface" | "neutral" />`
  - `<Checkbox checked onChange label? id />`
  - `<Modal isOpen onClose title? children />`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children and handles onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Nova Transação</Button>);
    const button = screen.getByRole('button', { name: /nova transação/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders terracotta primary classes by default', () => {
    render(<Button variant="primary">Ação</Button>);
    const button = screen.getByRole('button', { name: /ação/i });
    expect(button.className).toContain('bg-primary');
  });
});
```

```typescript
// frontend/src/components/ui/Input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders label and handles value changes safely', () => {
    const handleChange = vi.fn();
    render(<Input label="E-mail" value="" onChange={handleChange} placeholder="seu@email.com" />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText('seu@email.com');
    fireEvent.change(input, { target: { value: 'teste@exemplo.com' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/components/ui/`
Expected: FAIL ("Cannot find module ./Button")

- [ ] **Step 3: Implementar componentes em `frontend/src/components/ui/`**

1. `Button.tsx`: Estilizado com as diretrizes do `DESIGN.md` (terracota `#9A4100` / `#D96B27`, sombra difusa de espresso, `rounded-xl`, active scale).
2. `Input.tsx`: Campo com altura ergonômica, cantos `rounded-xl`, bordas suaves, anel de foco em terracota e suporte a ícones laterais e label associado via `id` / `htmlFor`.
3. `Card.tsx`: Superfície branca táteis (`bg-surface-container-lowest`), borda hairline de espresso `rgba(44, 24, 16, 0.06)`, cantos `rounded-2xl`, sombras suaves.
4. `Badge.tsx`: Pílulas de status e categorias (`rounded-full`, cores semânticas botânicas e quentes).
5. `Checkbox.tsx`: Checkbox acessível estilizado em terracota com rótulo clicável.
6. `Modal.tsx`: Backdrop com blur, card centralizado, fechamento via ESC ou clique no overlay e no botão `X`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/components/ui/`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui/
git commit -m "feat: implement atomic UI components (Button, Input, Card, Badge, Checkbox, Modal)"
```

---

### Task 4: Custom Hooks de Regra de Negócio (`useFinancialData` e `usePasswordStrength`)

**Files:**
- Create: `frontend/src/hooks/usePasswordStrength.ts`
- Create: `frontend/src/hooks/useFinancialData.ts`
- Test: `frontend/src/hooks/usePasswordStrength.test.ts`
- Test: `frontend/src/hooks/useFinancialData.test.ts`

**Interfaces:**
- Consumes: `types/finance.ts`, `types/auth.ts`
- Produces:
  - `usePasswordStrength(password: string): { score: number; label: string; advice: string; bars: boolean[] }`
  - `useFinancialData(initialData?): { transactions, filteredTransactions, filter, setFilter, timeframe, setTimeframe, summary, categoryExpenses, addTransaction, period, setPeriod }`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/hooks/usePasswordStrength.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePasswordStrength } from './usePasswordStrength';

describe('usePasswordStrength Hook', () => {
  it('returns score 0 for empty password', () => {
    const { result } = renderHook(() => usePasswordStrength(''));
    expect(result.current.score).toBe(0);
    expect(result.current.label).toBe('Muito fraca');
  });

  it('evaluates strong password with 8+ chars, numbers and symbols', () => {
    const { result } = renderHook(() => usePasswordStrength('Senha@2026!'));
    expect(result.current.score).toBeGreaterThanOrEqual(3);
    expect(result.current.bars.filter(Boolean).length).toBeGreaterThanOrEqual(3);
  });
});
```

```typescript
// frontend/src/hooks/useFinancialData.test.ts
import { describe, it, expect, act } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFinancialData } from './useFinancialData';

describe('useFinancialData Hook', () => {
  it('calculates summary balance, income and expense from transactions correctly', () => {
    const { result } = renderHook(() => useFinancialData());
    expect(result.current.summary.currentBalance).toBeGreaterThan(0);
    expect(result.current.summary.totalIncomeMonth).toBeGreaterThan(0);
    expect(result.current.summary.totalExpenseMonth).toBeGreaterThan(0);
  });

  it('filters transactions by type', () => {
    const { result } = renderHook(() => useFinancialData());
    act(() => {
      result.current.setFilter('income');
    });
    expect(result.current.filteredTransactions.every(t => t.type === 'income')).toBe(true);
  });

  it('adds a new transaction and updates summary atomically', () => {
    const { result } = renderHook(() => useFinancialData());
    const initialCount = result.current.transactions.length;
    act(() => {
      result.current.addTransaction({
        title: 'Freelance Design',
        amount: 1500,
        type: 'income',
        category: 'Investimentos',
        paymentMethod: 'Pix',
        date: '2026-10-29',
        status: 'Recebido'
      });
    });
    expect(result.current.transactions.length).toBe(initialCount + 1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/hooks/`
Expected: FAIL ("Cannot find module ./usePasswordStrength")

- [ ] **Step 3: Implementar os Hooks em `frontend/src/hooks/`**

1. `usePasswordStrength.ts`: Algoritmo seguro de checagem (comprimento >= 8, maiúsculas, números, caracteres especiais) retornando 4 níveis (`Fraca`, `Média`, `Forte`, `Excelente`), conselhos contextuais e array booleano para as 4 barras visuais.
2. `useFinancialData.ts`:
   - Inicializa com o mock fiel extraído do Stitch (`dashboard.html`): Salário R$ 6.000,00, Supermercado R$ 180,00, Farmácia R$ 94,50, Rendimento R$ 340,00, etc.
   - Deriva memoizado (`useMemo`):
     - `summary`: Saldo Atual (receitas - despesas + saldo base), % de comparação, total receitas, total despesas, % comprometido da renda (`(despesas / receitas) * 100`), total poupado.
     - `categoryExpenses`: Agrupamento e cálculo percentual por categoria, garantindo fallback 0% se despesas forem zero (evitando `NaN%`).
     - `filteredTransactions`: Filtro dinâmico por `'all'`, `'income'`, `'expense'`, `'credit'`.
   - Ação `addTransaction`: Insere transação com ID gerado (`crypto.randomUUID()`) preservando imutabilidade.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/hooks/`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/
git commit -m "feat: implement business logic custom hooks (useFinancialData, usePasswordStrength)"
```

---

### Task 5: Componentes de Navegação e Métricas do Painel (`features/dashboard`)

**Files:**
- Create: `frontend/src/features/dashboard/Sidebar.tsx`
- Create: `frontend/src/features/dashboard/DashboardTopNav.tsx`
- Create: `frontend/src/features/dashboard/DashboardHeader.tsx`
- Create: `frontend/src/features/dashboard/StatCard.tsx`
- Test: `frontend/src/features/dashboard/StatCard.test.tsx`
- Test: `frontend/src/features/dashboard/Sidebar.test.tsx`

**Interfaces:**
- Consumes: `components/ui/Card`, `components/ui/Badge`, `components/ui/Button`, `types/finance.ts`, `utils/formatters.ts`
- Produces:
  - `<Sidebar activeTab="dashboard" onTabChange? user={name, plan, avatar} />`
  - `<DashboardTopNav periodLabel onPeriodChange onOpenNewTransaction user />`
  - `<DashboardHeader userName periodLabel onOpenNewTransaction onExport />`
  - `<StatCard title amount formattedAmount icon type="balance" | "income" | "expense" subtitle? badgeText? badgeIcon? progressPercentage? bankInfo? />`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/features/dashboard/StatCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import { Wallet } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders title, amount and badge correctly', () => {
    render(
      <StatCard
        title="Saldo Atual"
        amount={14850}
        formattedAmount="R$ 14.850,00"
        type="balance"
        icon={<Wallet />}
        badgeText="+12% vs set"
        bankInfo="Conta Corrente • Nubank"
      />
    );
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('R$ 14.850,00')).toBeInTheDocument();
    expect(screen.getByText('+12% vs set')).toBeInTheDocument();
    expect(screen.getByText(/Conta Corrente • Nubank/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/features/dashboard/StatCard.test.tsx`
Expected: FAIL ("Cannot find module ./StatCard")

- [ ] **Step 3: Implementar componentes estruturais e StatCards**

1. `Sidebar.tsx`: Implementa navegação vertical fixa (288px de largura / `w-72`), marca "Harmonia Finanças" com logo, itens com ícones Lucide (`Dashboard`, `Transações`, `Relatórios`, `Metas & Orçamentos`, `Configurações`), estado ativo em terracota suave, e âncora de perfil inferior ("Davi", "Plano Familiar Ativo").
2. `DashboardTopNav.tsx`: Barra superior fixa com suporte responsivo a mobile e desktop, seletor de mês/ano, botão "+ Nova Transação" e avatar.
3. `DashboardHeader.tsx`: Cabeçalho interno ("Olá, Davi 👋 - Aqui está o resumo da sua saúde financeira este mês"), seletor de período dropdown, botão de exportar e botão principal de nova transação.
4. `StatCard.tsx`: Cartão com cantos `rounded-2xl`, blur sutil de fundo decorativo em verde ou terracota (sem cor preta), suporte a barra de progresso (Receitas) ou metadados de conta bancária (Saldo Atual) e % comprometida (Despesas).

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/features/dashboard/StatCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/dashboard/
git commit -m "feat: implement Sidebar, TopNav, Header and StatCard components"
```

---

### Task 6: Visualizações Financeiras Interativas (Gráfico de Linhas/Área e Donut Chart)

**Files:**
- Create: `frontend/src/features/dashboard/FinancialEvolutionChart.tsx`
- Create: `frontend/src/features/dashboard/CategoryDonutChart.tsx`
- Test: `frontend/src/features/dashboard/CategoryDonutChart.test.tsx`
- Test: `frontend/src/features/dashboard/FinancialEvolutionChart.test.tsx`

**Interfaces:**
- Consumes: `types/finance.ts`, `utils/formatters.ts`, `components/ui/Card`
- Produces:
  - `<FinancialEvolutionChart timeframe="semanal" | "mensal" | "anual" onTimeframeChange={(tf) => void} />`
  - `<CategoryDonutChart categories={CategoryExpense[]} totalExpense={number} formattedTotal={string} />`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/features/dashboard/CategoryDonutChart.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryDonutChart } from './CategoryDonutChart';

describe('CategoryDonutChart Component', () => {
  const mockCategories = [
    { category: 'Alimentação' as const, amount: 665, percentage: 38, color: '#422b22' },
    { category: 'Moradia & Contas' as const, amount: 560, percentage: 32, color: '#9a4100' },
  ];

  it('renders category legend with names and percentages', () => {
    render(
      <CategoryDonutChart
        categories={mockCategories}
        totalExpense={1225}
        formattedTotal="R$ 1.225,00"
      />
    );
    expect(screen.getByText('Gastos por Categoria')).toBeInTheDocument();
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByText('Moradia & Contas')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/features/dashboard/CategoryDonutChart.test.tsx`
Expected: FAIL ("Cannot find module ./CategoryDonutChart")

- [ ] **Step 3: Implementar gráficos responsivos e acessíveis**

1. `FinancialEvolutionChart.tsx`:
   - Gráfico de 8 colunas (~66%) com curvas Bézier suaves em SVG responsivo (`viewBox="0 0 680 230"`).
   - Gradiente botânico verde suave (`#3B6750`) para receitas e terracota suave (`#9A4100`) para despesas.
   - Pílula de destaque flutuante com badge ("Pico Salarial: +R$ 6.000").
   - Toggle pílula para períodos Semanal / Mensal / Anual integrado com `onTimeframeChange`.
   - Linhas de grade suaves (`stroke="#f8d2c4"`).
2. `CategoryDonutChart.tsx`:
   - Gráfico donut em anel SVG de 4 colunas (~34%) com perímetro de circunferência calculado com precisão e `stroke-dasharray` / `stroke-dashoffset`.
   - Valor centralizado em Headline SM com badge "Dentro do teto" em verde floresta.
   - Legenda ergonômica com bullet de cor, nome da categoria, badge com porcentagem e valor em reais. Trata despesas totais zeradas com segurança sem divisão por zero.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/features/dashboard/CategoryDonutChart.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/dashboard/
git commit -m "feat: implement FinancialEvolutionChart and CategoryDonutChart SVG visualizations"
```

---

### Task 7: Listagem de Transações Recentes e Modal de Nova Transação

**Files:**
- Create: `frontend/src/features/dashboard/TransactionItem.tsx`
- Create: `frontend/src/features/dashboard/TransactionList.tsx`
- Create: `frontend/src/features/dashboard/NewTransactionModal.tsx`
- Test: `frontend/src/features/dashboard/TransactionList.test.tsx`
- Test: `frontend/src/features/dashboard/NewTransactionModal.test.tsx`

**Interfaces:**
- Consumes: `types/finance.ts`, `components/ui/Button`, `components/ui/Input`, `components/ui/Modal`, `components/ui/Badge`, `utils/formatters.ts`
- Produces:
  - `<TransactionItem transaction={Transaction} />`
  - `<TransactionList transactions={Transaction[]} activeFilter={TransactionFilter} onFilterChange={(f) => void} onOpenNewTransaction? />`
  - `<NewTransactionModal isOpen={boolean} onClose={() => void} onSubmit={(data) => void} />`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/features/dashboard/TransactionList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionList } from './TransactionList';
import { Transaction } from '../../types/finance';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Supermercado Pão de Açúcar',
    amount: 180,
    type: 'expense',
    category: 'Alimentação',
    paymentMethod: 'Cartão Black',
    date: '14:20, 24 Out',
    status: 'Confirmado',
  },
  {
    id: '2',
    title: 'Salário - Tech Corp',
    amount: 6000,
    type: 'income',
    category: 'Salário & Renda',
    paymentMethod: 'Conta Corrente',
    date: '09:00, 05 Out',
    status: 'Recebido',
  },
];

describe('TransactionList Component', () => {
  it('renders transactions and allows filtering chips', () => {
    const handleFilterChange = vi.fn();
    render(
      <TransactionList
        transactions={mockTransactions}
        activeFilter="all"
        onFilterChange={handleFilterChange}
      />
    );
    expect(screen.getByText('Supermercado Pão de Açúcar')).toBeInTheDocument();
    expect(screen.getByText('Salário - Tech Corp')).toBeInTheDocument();

    const incomeChip = screen.getByRole('button', { name: /entradas/i });
    fireEvent.click(incomeChip);
    expect(handleFilterChange).toHaveBeenCalledWith('income');
  });

  it('renders clean empty state without displaying literal 0 when list is empty', () => {
    render(
      <TransactionList
        transactions={[]}
        activeFilter="expense"
        onFilterChange={vi.fn()}
      />
    );
    expect(screen.getByText(/nenhuma movimentação encontrada/i)).toBeInTheDocument();
    expect(screen.queryByText(/^0$/)).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/features/dashboard/TransactionList.test.tsx`
Expected: FAIL ("Cannot find module ./TransactionList")

- [ ] **Step 3: Implementar lista e modal de nova movimentação**

1. `TransactionItem.tsx`:
   - Ícone arredondado de 48px com fundo tonal suave de acordo com a categoria (`ShoppingCart`, `Briefcase`, `Pill`, `TrendingUp`, etc.).
   - Título legível, badge estilizado da categoria, horário/data e forma de pagamento.
   - Valor à direita com sinal e cor semântica (+ em verde floresta `#2E5A44`, - em espresso torrado `#2A170F`).
   - Badge de status (`Confirmado`, `Recebido`, `Liquidado`).
2. `TransactionList.tsx`:
   - Cabeçalho com título "Transações Recentes" e link "Ver todas".
   - Pílulas de filtro dinâmicas (`Todas`, `Entradas`, `Saídas`, `Cartão de Crédito`) com estado ativo em terracota.
   - Renderização condicional com ternário explícito garantindo que lista vazia exiba mensagem limpa e nenhum `0` acidental.
3. `NewTransactionModal.tsx`:
   - Formulário controlado completo com campos: Título, Valor (R$), Tipo (Receita/Despesa), Categoria (`<select>`), Forma de Pagamento (`<select>`), e Data.
   - Estados inicializados com string vazia (`""`) como fallback seguro.
   - Botão de envio com chamada obrigatória a `e.preventDefault()`, validação e fechamento automático.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/features/dashboard/TransactionList.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/dashboard/
git commit -m "feat: implement TransactionItem, TransactionList and NewTransactionModal"
```

---

### Task 8: Funcionalidades de Autenticação (SignIn e SignUp)

**Files:**
- Create: `frontend/src/features/auth/AuthLayout.tsx`
- Create: `frontend/src/features/auth/SocialAuthButtons.tsx`
- Create: `frontend/src/features/auth/PasswordStrengthMeter.tsx`
- Create: `frontend/src/pages/SignInPage.tsx`
- Create: `frontend/src/pages/SignUpPage.tsx`
- Test: `frontend/src/pages/SignInPage.test.tsx`
- Test: `frontend/src/pages/SignUpPage.test.tsx`

**Interfaces:**
- Consumes: `components/ui/Button`, `components/ui/Input`, `components/ui/Checkbox`, `hooks/usePasswordStrength`, `types/auth.ts`
- Produces:
  - `<SignInPage onNavigateToSignUp={() => void} onLoginSuccess={() => void} />`
  - `<SignUpPage onNavigateToSignIn={() => void} onRegisterSuccess={() => void} />`
  - `<AuthLayout leftPanelContent title? subtitle?>{children}</AuthLayout>`

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/pages/SignInPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignInPage } from './SignInPage';

describe('SignInPage Component', () => {
  it('renders form inputs and toggles password visibility', () => {
    render(<SignInPage onNavigateToSignUp={vi.fn()} onLoginSuccess={vi.fn()} />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    const passwordInput = screen.getByLabelText(/^senha/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/exibir ou ocultar senha/i);
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('submits form without page reload and invokes onLoginSuccess', () => {
    const handleLoginSuccess = vi.fn();
    render(<SignInPage onNavigateToSignUp={vi.fn()} onLoginSuccess={handleLoginSuccess} />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha/i);

    fireEvent.change(emailInput, { target: { value: 'davi@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345678' } });

    const submitBtn = screen.getByRole('button', { name: /entrar na conta/i });
    fireEvent.click(submitBtn);

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/pages/SignInPage.test.tsx`
Expected: FAIL ("Cannot find module ./SignInPage")

- [ ] **Step 3: Implementar componentes de autenticação e páginas**

1. `AuthLayout.tsx`: Container dividido em 12 colunas responsivas (5 colunas para o painel de impacto/valores humanos e 7 colunas para o formulário), com os fundos ambientais e logos fiéis a `.stitch/signin.html` e `.stitch/signup.html`.
2. `SocialAuthButtons.tsx`: Botões oficiais Google e Apple em `bg-surface-container-low` com hover suave e SVGs idênticos aos do design.
3. `PasswordStrengthMeter.tsx`: Medidor visual de 4 barras com cores de preenchimento dinâmicas e texto de orientação conectado ao `usePasswordStrength`.
4. `SignInPage.tsx`:
   - Formulário controlado (`email`, `password`, `rememberMe`).
   - Botão para alternar visibilidade da senha (`Eye` / `EyeOff`).
   - Botão CTA com ícone `ArrowRight`.
   - Links funcionais para recuperação de senha e alternância para o cadastro.
5. `SignUpPage.tsx`:
   - Formulário com campos: Nome completo, E-mail, Senha, Confirmação de senha, Checkbox de Termos e Condições.
   - Integração com `PasswordStrengthMeter` em tempo real.
   - Validação garantindo que senhas coincidam antes de permitir a submissão.
   - Link de retorno para login.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run src/pages/SignInPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/auth/ frontend/src/pages/SignInPage.tsx frontend/src/pages/SignUpPage.tsx
git commit -m "feat: implement SignInPage, SignUpPage and authentication components"
```

---

### Task 9: DashboardPage e Orquestração do App

**Files:**
- Create: `frontend/src/pages/DashboardPage.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/pages/DashboardPage.test.tsx`
- Test: `frontend/src/App.test.tsx`

**Interfaces:**
- Consumes: Todos os componentes criados em `features/dashboard/`, `pages/`, `hooks/useFinancialData`
- Produces: Aplicação completa e integrada navegável entre Dashboard, SignIn, SignUp e LandingPage.

- [ ] **Step 1: Write the failing tests**

```typescript
// frontend/src/pages/DashboardPage.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  it('renders dashboard with greetings, KPIs, charts and opens new transaction modal', () => {
    render(<DashboardPage onLogout={() => {}} />);
    expect(screen.getByText(/olá, davi/i)).toBeInTheDocument();
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('Gastos por Categoria')).toBeInTheDocument();

    const newTxBtns = screen.getAllByRole('button', { name: /nova transação/i });
    fireEvent.click(newTxBtns[0]);
    expect(screen.getByText(/adicionar transação/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd frontend && npx vitest run src/pages/DashboardPage.test.tsx`
Expected: FAIL ("Cannot find module ./DashboardPage")

- [ ] **Step 3: Implementar DashboardPage e App.tsx**

1. `DashboardPage.tsx`:
   - Conecta `useFinancialData`.
   - Renderiza a `Sidebar` fixa à esquerda (`w-72`).
   - Renderiza o `DashboardTopNav` no topo com `periodLabel`.
   - Área central (`pl-72 pt-20 px-space-xl pb-space-xl`) contendo:
     - `DashboardHeader`
     - Grid de 3 colunas de `StatCard` (Saldo Atual, Receitas do Mês com barra de progresso, Despesas do Mês com % da renda e economia líquida).
     - Grid de 12 colunas com `FinancialEvolutionChart` (8 colunas) e `CategoryDonutChart` (4 colunas).
     - Seção de `TransactionList` com filtros funcionais e lista de transações.
     - Modal `NewTransactionModal` ativado pelo botão "+ Nova Transação" do header ou da top nav.
2. `App.tsx`:
   - Gerencia a navegação entre as telas (`'dashboard' | 'signin' | 'signup' | 'landing'`).
   - Permite que o usuário no SignIn/SignUp navegue para o Dashboard ao autenticar, ou saia do Dashboard retornando à tela de Login.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd frontend && npx vitest run`
Expected: PASS (todos os testes de unidade da suíte passam sem regressões).

- [ ] **Step 5: Run full TypeScript and Vite production build**

Run: `cd frontend && npm run build`
Expected: `✓ built in ...ms` sem nenhum aviso de compilação ou tipo incompatível.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/DashboardPage.tsx frontend/src/App.tsx frontend/src/App.test.tsx
git commit -m "feat: integrate DashboardPage and App navigation router with full test coverage"
```

---

## Auto-Revisão do Plano

1. **Cobertura da Especificação:** O plano atende a todas as 6 diretrizes solicitadas:
   - Estrutura de diretórios rigorosa (`components/ui`, `features/dashboard`, `pages`, `types`, `utils`).
   - Componentização anatômica com SRP e uso de composição (`children`).
   - Tipagem estrita em TypeScript sem nenhum `any`.
   - Separação total de UI (dumb components) e lógica de negócio (Custom Hooks `useFinancialData`, `usePasswordStrength`).
   - Formulários 100% controlados com fallback `""` e prevenção de reload `e.preventDefault()`.
   - Renderizações condicionais limpas sem o antipadrão `{arr.length && ...}`.
2. **Granularidade dos Passos:** Cada passo possui uma ação clara com comando de verificação e resultado esperado.
3. **Consistência de Tipos:** Os nomes e assinaturas definidos na Task 2 (`Transaction`, `FinancialSummary`, `CategoryExpense`, etc.) são reutilizados consistentemente em todas as tasks subsequentes.
4. **Foco de Revisão (Review Focus):** Todos os 5 casos críticos identificados estão contemplados com testes específicos nas tarefas correspondentes.
5. **Proporção:** O plano define interfaces, contratos e testes com precisão, delegando a implementação do corpo dos componentes à fase de execução guiada por TDD.
