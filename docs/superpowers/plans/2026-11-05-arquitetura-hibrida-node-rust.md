# Arquitetura Híbrida (Node.js + Rust) - Biana Finance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o backend híbrido do Biana Finance com Node.js (Fastify + Prisma) cuidando de Auth/CRUD/Banco e Rust (via NAPI-RS) processando os cálculos de métricas e gráficos, conectando com as páginas de Dashboard e Transações do frontend React.

**Architecture:** A aplicação mantém uma arquitetura monolítica simplificada: o backend Node.js (Fastify + TypeScript) expõe a API REST e orquestra o banco de dados (Prisma/SQLite ou Postgres). O core numérico é uma crate Rust (`finance-engine`) compilada como módulo nativo C++/Node via `napi-rs`, invocada diretamente em memória pelo Fastify sem sobrecarga de rede HTTP. O frontend consome os endpoints autenticados via JWT e renderiza os gráfics do Recharts com os agregados computados no Rust.

**Tech Stack:** Node.js (v20+), Fastify, TypeScript, Prisma ORM, SQLite/PostgreSQL, Rust (edition 2024), `napi-rs`, Vitest, Cargo, React 19, Recharts, Tailwind CSS.

**Spec:** [Requisitos.md](file:///home/davi/Coding/Projects/Biana_Finance/Requisitos.md) e [System Design.md](file:///home/davi/Coding/Projects/Biana_Finance/System%20Design.md)

## Global Constraints

- Backend implementado em Node.js com TypeScript e Fastify.
- Persistência desacoplada através do Prisma ORM (banco relacional).
- Motor de cálculo financeiro isolado em Rust via `napi-rs` gerando tipagem `.d.ts`.
- Autenticação stateless via JWT com hash seguro de senhas (bcrypt/argon2).
- Zero perda de precisão em cálculos financeiros (uso de tipos adequados em Rust e centavos inteiros ou decimais fixos).
- No mínimo duas telas completamente funcionais e integradas ponta a ponta: **Dashboard** e **Transações**.

## Review Focus

1. **Transações vazias ou usuário novo:** O motor Rust deve tratar vetores vazios sem causar divisão por zero ao calcular percentuais de categoria e saldos.
2. **Precisão monetária de ponto flutuante:** Assegurar que valores monetários somados em Rust não gerem erros clássicos de arredondamento IEEE-754 (ex: `0.1 + 0.2 = 0.30000000000000004`).
3. **Token JWT expirado ou inválido:** Middleware do Fastify deve rejeitar requisições com 401 Unauthorized e o frontend deve redirecionar para a tela de SignIn sem quebrar a UI.
4. **Filtro de período:** Ao alterar o filtro de tempo no Dashboard (ex: "Outubro 2024" ou "Últimos 30 dias"), apenas transações daquele intervalo devem ser enviadas e calculadas.
5. **Compilação cruzada do módulo nativo Rust:** O build do `napi-rs` deve funcionar em ambiente de desenvolvimento local sem passos manuais complexos.

---

## Estrutura de Pastas Alvo

```text
Biana_Finance/
├── Cargo.toml                   # Workspace Cargo ou raiz do projeto
├── package.json                 # Scripts raiz (npm run dev, build, etc.)
├── docker-compose.yml           # Serviços auxiliares
├── backend/                     # Servidor Fastify (Node.js + TS)
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma        # Modelos: User, Transaction, Category
│   └── src/
│       ├── index.ts             # Entrada do servidor Fastify
│       ├── routes/              # auth.routes.ts, transaction.routes.ts, metrics.routes.ts
│       ├── services/            # auth.service.ts, transaction.service.ts
│       └── middlewares/         # auth.middleware.ts
├── crates/
│   └── finance-engine/          # Módulo Rust (NAPI-RS)
│       ├── Cargo.toml
│       ├── src/
│       │   ├── lib.rs           # Exportações NAPI-RS para o Node
│       │   ├── summary.rs       # KPI: saldo, receitas, despesas
│       │   ├── categories.rs    # Distribuição e percentuais por categoria
│       │   └── evolution.rs     # Série temporal de evolução patrimonial
│       └── tests/               # Testes unitários do Rust
└── frontend/                    # Aplicação React existente
    └── src/
        ├── hooks/               # useFinancialData.ts (conectado à API)
        ├── services/            # api.ts (chamadas HTTP autenticadas)
        └── pages/               # DashboardPage.tsx, TransactionsPage.tsx, SignInPage.tsx
```

---

## Cronograma Dia a Dia (Milestones)

- **Dia 1:** Configuração do backend Node (Fastify + Prisma + Banco de Dados) e autenticação JWT.
- **Dia 2:** Motor de Cálculos em Rust (`finance-engine`) via NAPI-RS com testes unitários em Rust.
- **Dia 3:** API REST de Transações + Integração Fastify chamando o módulo Rust em memória.
- **Dia 4:** Integração ponta a ponta com o Frontend (Dashboard com gráficos dinâmicos e Transações com CRUD real).

---

## Tarefas de Implementação

### Task 1: Setup do Backend Node.js (Fastify + Prisma + Modelagem do Banco)

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/prisma/schema.prisma`
- Create: `backend/src/lib/prisma.ts`
- Create: `backend/src/server.ts`
- Test: `backend/tests/setup.test.ts`

**Interfaces:**
- Produces: `prisma` client configurado, instância do servidor Fastify inicializável na porta 3333.
- Models: `User` (id, email, passwordHash, name), `Transaction` (id, userId, title, amount, type, category, paymentMethod, date, status).

- [ ] **Step 1: Criar arquivos de configuração do backend (`package.json`, `tsconfig.json`)**

Configurar Fastify, `@fastify/cors`, `@fastify/jwt`, `@prisma/client`, `zod`, `vitest` e TypeScript.

- [ ] **Step 2: Definir o schema Prisma com SQLite (para desenvolvimento ágil inicial) ou PostgreSQL**

No `backend/prisma/schema.prisma`, modelar tabelas `User` e `Transaction` com relações e índices em `userId` e `date`.

- [ ] **Step 3: Escrever teste de verificação da inicialização do Fastify**

```typescript
// backend/tests/setup.test.ts
import { describe, it, expect } from 'vitest';
import { buildServer } from '../src/server';

describe('Server Setup', () => {
  it('should respond to /health endpoint with ok status', async () => {
    const app = await buildServer();
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});
```

- [ ] **Step 4: Executar o teste para verificar a falha**

Run: `npm --prefix backend test`
Expected: FAIL (módulo ou rota `/health` não implementada).

- [ ] **Step 5: Implementar `backend/src/server.ts` com o endpoint `/health` e export do `buildServer`**

- [ ] **Step 6: Executar o teste e rodar `npx prisma db push`**

Run: `npm --prefix backend test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat(backend): setup fastify, prisma schema and health check"
```

---

### Task 2: Autenticação JWT e Rotas de Auth (Node.js)

**Files:**
- Create: `backend/src/routes/auth.routes.ts`
- Create: `backend/src/services/auth.service.ts`
- Create: `backend/src/middlewares/auth.middleware.ts`
- Test: `backend/tests/auth.test.ts`

**Interfaces:**
- Consumes: `prisma.user`
- Produces: `POST /api/auth/register` (recebe `{ email, password, name }`), `POST /api/auth/login` (retorna `{ token, user }`), middleware `authenticate(request, reply)`.

- [ ] **Step 1: Escrever teste de cadastro e login de usuário com JWT**

```typescript
// backend/tests/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildServer } from '../src/server';
import { prisma } from '../src/lib/prisma';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should register a new user and return user data', async () => {
    const app = await buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: { email: 'test@biana.com', password: 'password123', name: 'Davi' },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().user.email).toBe('test@biana.com');
  });

  it('should authenticate user and return jwt token', async () => {
    const app = await buildServer();
    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: { email: 'login@biana.com', password: 'password123', name: 'Davi' },
    });
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'login@biana.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('token');
  });
});
```

- [ ] **Step 2: Executar teste e validar falha**

Run: `npm --prefix backend test`
Expected: FAIL com 404 para `/api/auth/register`.

- [ ] **Step 3: Implementar hashing de senha (bcryptjs) e rotas em `backend/src/routes/auth.routes.ts`**

Validar inputs com `zod`, hashear com salt rounds, emitir JWT no login via `@fastify/jwt`.

- [ ] **Step 4: Executar testes e validar aprovação**

Run: `npm --prefix backend test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/
git commit -m "feat(auth): implement registration and login with jwt"
```

---

### Task 3: Criação do Motor Rust com NAPI-RS (`finance-engine`)

**Files:**
- Create: `crates/finance-engine/Cargo.toml`
- Create: `crates/finance-engine/build.rs`
- Create: `crates/finance-engine/src/lib.rs`
- Create: `crates/finance-engine/src/summary.rs`
- Create: `crates/finance-engine/src/categories.rs`
- Test: `crates/finance-engine/tests/calculations_test.rs`

**Interfaces:**
- Produces: Módulo nativo exportando:
  - `compute_financial_summary(transactions: Vec<RawTransaction>) -> FinancialSummaryDto`
  - `compute_category_distribution(transactions: Vec<RawTransaction>) -> Vec<CategoryExpenseDto>`
- Tipos:
  - `RawTransaction`: `{ id: String, amount: f64, transaction_type: String, category: String, date: String }`
  - `FinancialSummaryDto`: `{ current_balance: f64, total_income: f64, total_expenses: f64, savings_rate: f64 }`
  - `CategoryExpenseDto`: `{ category: String, amount: f64, percentage: f64, count: u32 }`

- [ ] **Step 1: Configurar a Crate com dependência `napi` e `napi-derive`**

Definir `crate-type = ["cdylib"]` no `crates/finance-engine/Cargo.toml`.

- [ ] **Step 2: Escrever testes unitários em Rust para verificação das contas financeiras**

```rust
// crates/finance-engine/tests/calculations_test.rs
use finance_engine::summary::{compute_summary, RawTransaction};

#[test]
fn test_compute_summary_correct_kpis() {
    let txs = vec![
        RawTransaction { id: "1".into(), amount: 5000.0, transaction_type: "income".into(), category: "Salário".into(), date: "2026-10-01".into() },
        RawTransaction { id: "2".into(), amount: 1500.0, transaction_type: "expense".into(), category: "Moradia".into(), date: "2026-10-05".into() },
        RawTransaction { id: "3".into(), amount: 500.0, transaction_type: "expense".into(), category: "Alimentação".into(), date: "2026-10-10".into() },
    ];
    let summary = compute_summary(&txs);
    assert_eq!(summary.total_income, 5000.0);
    assert_eq!(summary.total_expenses, 2000.0);
    assert_eq!(summary.current_balance, 3000.0);
    assert_eq!(summary.savings_rate, 60.0); // 3000/5000 * 100
}

#[test]
fn test_empty_transactions_do_not_panic() {
    let txs = vec![];
    let summary = compute_summary(&txs);
    assert_eq!(summary.current_balance, 0.0);
    assert_eq!(summary.savings_rate, 0.0);
}
```

- [ ] **Step 3: Executar testes do Rust para confirmar a falha**

Run: `cargo test --package finance-engine`
Expected: FAIL (módulo ou funções não encontradas).

- [ ] **Step 4: Implementar `summary.rs` e `categories.rs` com segurança numérica e bindings NAPI-RS**

Expor structs anotadas com `#[napi(object)]` e funções anotadas com `#[napi]`.

- [ ] **Step 5: Executar testes em Rust e compilar o artefato NAPI**

Run: `cargo test --package finance-engine`
Expected: PASS

- [ ] **Step 6: Configurar script de build do napi no backend para gerar o `.node` e `.d.ts`**

Adicionar script no `package.json` raiz: `"build:engine": "napi build --platform --release --manifest-path crates/finance-engine/Cargo.toml --output-dir backend/src/native"`.

- [ ] **Step 7: Commit**

```bash
git add crates/finance-engine/
git commit -m "feat(engine): implement rust financial calculations with napi-rs"
```

---

### Task 4: API de Transações e Integração Fastify + Rust Native Engine

**Files:**
- Create: `backend/src/routes/transaction.routes.ts`
- Create: `backend/src/routes/metrics.routes.ts`
- Create: `backend/src/services/metrics.service.ts`
- Modify: `backend/src/server.ts`
- Test: `backend/tests/transactions_and_metrics.test.ts`

**Interfaces:**
- Consumes: Módulo nativo Rust compilado em `backend/src/native/finance-engine.node`, tabela `Transaction` do Prisma.
- Produces:
  - `POST /api/transactions` (Criação de transação)
  - `GET /api/transactions` (Listagem com filtros de data/tipo)
  - `GET /api/metrics/dashboard` (Retorna resumo calculado pelo Rust: `{ summary, categoryExpenses, evolution }`)

- [ ] **Step 1: Escrever teste de integração entre rota Fastify e motor Rust**

```typescript
// backend/tests/transactions_and_metrics.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildServer } from '../src/server';
import { prisma } from '../src/lib/prisma';

describe('Metrics and Transactions API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();
    const app = await buildServer();
    const reg = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: { email: 'metrics@biana.com', password: 'password123', name: 'Davi' },
    });
    token = reg.json().token;
    userId = reg.json().user.id;
  });

  it('should create transaction and return metrics computed by rust', async () => {
    const app = await buildServer();
    // 1. Criar transações
    await app.inject({
      method: 'POST',
      url: '/api/transactions',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Salário', amount: 4000, type: 'income', category: 'Salário & Renda', paymentMethod: 'Conta Corrente', date: '2026-10-05T09:00:00Z' }
    });
    await app.inject({
      method: 'POST',
      url: '/api/transactions',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Mercado', amount: 1000, type: 'expense', category: 'Alimentação', paymentMethod: 'Cartão Black', date: '2026-10-10T14:00:00Z' }
    });

    // 2. Buscar métricas do dashboard
    const metricsRes = await app.inject({
      method: 'GET',
      url: '/api/metrics/dashboard',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(metricsRes.statusCode).toBe(200);
    const body = metricsRes.json();
    expect(body.summary.currentBalance).toBe(3000);
    expect(body.summary.totalIncome).toBe(4000);
    expect(body.summary.totalExpenses).toBe(1000);
    expect(body.categoryExpenses).toHaveLength(1);
    expect(body.categoryExpenses[0].category).toBe('Alimentação');
    expect(body.categoryExpenses[0].percentage).toBe(100);
  });
});
```

- [ ] **Step 2: Executar teste e validar falha**

Run: `npm --prefix backend test`
Expected: FAIL com rotas não encontradas.

- [ ] **Step 3: Implementar rotas de transações e `metrics.service.ts` importando o módulo Rust**

Chamar `compute_financial_summary` e `compute_category_distribution` do módulo nativo passando as transações buscadas do banco Prisma.

- [ ] **Step 4: Executar testes de ponta a ponta no backend**

Run: `npm --prefix backend test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/
git commit -m "feat(api): integrate transactions and rust-computed metrics endpoints"
```

---

### Task 5: Integração do Frontend (Conexão da API Real no Dashboard e Transações)

**Files:**
- Create: `frontend/src/services/api.ts`
- Modify: `frontend/src/hooks/useFinancialData.ts`
- Modify: `frontend/src/pages/DashboardPage.tsx`
- Modify: `frontend/src/pages/TransactionsPage.tsx`
- Test: `frontend/src/pages/DashboardPage.test.tsx`

**Interfaces:**
- Consumes: Endpoints do Fastify `http://localhost:3333/api/...`
- Produces: Hook `useFinancialData` consumindo dados reais do backend com fallback e estado de loading/error.

- [ ] **Step 1: Criar cliente de API HTTP com suporte a Bearer Token (`frontend/src/services/api.ts`)**

Funções tipadas para `fetchDashboardMetrics()`, `fetchTransactions()`, `createTransaction()`.

- [ ] **Step 2: Atualizar `useFinancialData.ts` para carregar dados reais e disparar mutações**

Substituir o estado estático de `INITIAL_TRANSACTIONS` por chamada à API com `useEffect`, mantendo a assinatura exata que `DashboardPage` e `TransactionsPage` esperam.

- [ ] **Step 3: Atualizar teste de renderização do `DashboardPage.test.tsx` com mock de API**

Garantir que os valores dos cards de Saldo, Receitas, Despesas e os gráficos do Recharts continuem renderizando sem erro ao receber os dados reais do Rust.

- [ ] **Step 4: Executar testes do frontend**

Run: `npm --prefix frontend test`
Expected: PASS

- [ ] **Step 5: Teste manual de inicialização conjunta**

Adicionar script no `package.json` raiz:
```json
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
```
Verificar no navegador que cadastrar uma transação na página **Transações** atualiza automaticamente os KPIs e gráficos da página **Dashboard**.

- [ ] **Step 6: Commit**

```bash
git add frontend/ package.json
git commit -m "feat(frontend): connect dashboard and transactions pages to rust-powered backend"
```

---

## Verificação Final do Sistema

- [ ] Rodar os testes do Rust: `cargo test` (todos passando).
- [ ] Rodar os testes do Backend: `npm --prefix backend test` (todos passando).
- [ ] Rodar os testes do Frontend: `npm --prefix frontend test` (todos passando).
- [ ] Verificar que o cálculo de categorias soma exatamente 100% no gráfico de Rosca do Dashboard.
- [ ] Verificar persistência real cadastrando transações via formulário modal e recarregando a página.
