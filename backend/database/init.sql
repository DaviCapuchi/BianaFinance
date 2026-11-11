-- ============================================================================
-- BIANA FINANCE - ESTRUTURA DE BANCO DE DADOS PARA PRODUÇÃO (PostgreSQL 16+)
-- ============================================================================
-- Arquitetura: Relacional Normalizada (3ª Forma Normal - 3FN)
-- Precisão Monetária: NUMERIC(15, 2) (Zero erro de ponto flutuante IEEE-754)
-- Identificadores: UUID v4 nativos (Segurança contra enumeração / IDOR)
-- Datas e Fusos: TIMESTAMPTZ (Armazenamento padronizado em UTC)
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. EXTENSÕES
-- ----------------------------------------------------------------------------
-- pgcrypto fornece funções criptográficas e suporte adicional a UUIDs
-- citext permite colunas de texto Case-Insensitive (ideal para e-mails e tickers)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ----------------------------------------------------------------------------
-- 2. TIPOS ENUMERADOS (DOMÍNIOS ESTRITOS)
-- ----------------------------------------------------------------------------
-- Garantem integridade no nível do banco: valores fora da lista são rejeitados.

CREATE TYPE subscription_plan_type AS ENUM ('free', 'pro', 'family_wealth');
CREATE TYPE household_role_type AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE member_status_type AS ENUM ('active', 'invited', 'revoked');

CREATE TYPE account_type AS ENUM (
    'checking',     -- Conta Corrente
    'savings',      -- Conta Poupança / Reserva
    'credit_card',  -- Cartão de Crédito / Black
    'investment',   -- Corretora de Investimentos
    'cash'          -- Carteira Física / Dinheiro em Espécie
);

CREATE TYPE connection_status_type AS ENUM (
    'connected',    -- Open Finance sincronizado
    'syncing',      -- Sincronizando no momento
    'manual',       -- Gerenciada manualmente pelo usuário
    'error'         -- Falha de sincronização
);

CREATE TYPE transaction_type AS ENUM ('income', 'expense');

CREATE TYPE payment_method_type AS ENUM (
    'checking_account', -- Conta Corrente / TED
    'black_card',       -- Cartão Black
    'credit_card',      -- Cartão de Crédito tradicional
    'debit_card',       -- Cartão de Débito
    'pix',              -- Pix instantâneo
    'brokerage',        -- Conta Corretora
    'cash'              -- Dinheiro em espécie
);

CREATE TYPE transaction_status_type AS ENUM (
    'confirmed',    -- Confirmado
    'received',     -- Recebido
    'settled',      -- Liquidado
    'pending'       -- Pendente / Agendado
);

CREATE TYPE recurrence_frequency_type AS ENUM (
    'weekly',       -- Semanal
    'monthly',      -- Mensal
    'yearly'        -- Anual
);

CREATE TYPE goal_status_type AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE contribution_type AS ENUM ('deposit', 'withdrawal');

CREATE TYPE asset_class_type AS ENUM (
    'stock',        -- Ações (ex: WEGE3, PETR4)
    'fii',          -- Fundos Imobiliários (ex: HGLG11)
    'etf',          -- ETFs (ex: IVVB11)
    'fixed_income', -- Renda Fixa (CDB, Tesouro Direto)
    'crypto'        -- Criptoativos
);

CREATE TYPE investment_operation_type AS ENUM (
    'buy',          -- Compra de ativo
    'sell',         -- Venda de ativo
    'dividend',     -- Dividendos (isentos)
    'jcp',          -- Juros sobre Capital Próprio
    'rent'          -- Aluguel de ações / Rendimento FII
);

-- ----------------------------------------------------------------------------
-- 3. FUNÇÃO DE AUDITORIA AUTOMÁTICA (TRIGGER DE UPDATED_AT)
-- ----------------------------------------------------------------------------
-- Atualiza automaticamente a coluna updated_at sempre que uma linha sofre UPDATE.
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4. TABELA: users (Usuários e Credenciais de Autenticação)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(120) NOT NULL CHECK (char_length(trim(full_name)) >= 2),
    email               CITEXT NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    phone               VARCHAR(30),
    avatar_url          TEXT,
    plan                subscription_plan_type NOT NULL DEFAULT 'free',
    two_factor_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMPTZ -- Soft Delete: preserva histórico caso o usuário desative a conta
);

COMMENT ON TABLE users IS 'Identidades individuais e credenciais de autenticação do sistema.';
COMMENT ON COLUMN users.email IS 'Tipo CITEXT garante unicidade ignorando maiúsculas/minúsculas (Davi@biana.com == davi@biana.com).';
COMMENT ON COLUMN users.deleted_at IS 'Preenchido quando o usuário sofre exclusão lógica (Soft Delete).';

-- ----------------------------------------------------------------------------
-- 5. TABELA: user_preferences (Relacionamento 1:1 com users)
-- ----------------------------------------------------------------------------
-- Separada de users para manter a tabela de autenticação enxuta e rápida
-- durante validações de JWT e login.
CREATE TABLE user_preferences (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    currency_code           CHAR(3) NOT NULL DEFAULT 'BRL' CHECK (currency_code IN ('BRL', 'USD', 'EUR')),
    billing_cycle_day       SMALLINT NOT NULL DEFAULT 1 CHECK (billing_cycle_day BETWEEN 1 AND 31),
    notify_push             BOOLEAN NOT NULL DEFAULT TRUE,
    notify_email_weekly     BOOLEAN NOT NULL DEFAULT TRUE,
    notify_budget_alerts    BOOLEAN NOT NULL DEFAULT TRUE,
    budget_alert_threshold  SMALLINT NOT NULL DEFAULT 80 CHECK (budget_alert_threshold BETWEEN 1 AND 100),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_preferences IS 'Relacionamento 1:1 estrito com users. Guarda configurações regionais e de alertas.';

-- ----------------------------------------------------------------------------
-- 6. TABELA: households (Núcleo Familiar / Workspace Financeiro)
-- ----------------------------------------------------------------------------
-- Todas as contas, transações e metas pertencem a um "household" (família/lar).
-- Se o usuário usar o app sozinho, ele terá um household individual. Se casar ou
-- convidar filhos, basta adicioná-los em household_members sem migrar transações!
CREATE TABLE households (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL CHECK (char_length(trim(name)) >= 2),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE households IS 'Entidade central de agrupamento patrimonial (Núcleo Familiar ou Conta Individual).';

-- ----------------------------------------------------------------------------
-- 7. TABELA: household_members (Relacionamento N:N entre users e households)
-- ----------------------------------------------------------------------------
CREATE TABLE household_members (
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role                household_role_type NOT NULL DEFAULT 'member',
    relationship_label  VARCHAR(50) NOT NULL DEFAULT 'Membro', -- Ex: 'Administrador Familiar', 'Cônjuge', 'Filha'
    status              member_status_type NOT NULL DEFAULT 'active',
    joined_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (household_id, user_id)
);

COMMENT ON TABLE household_members IS 'Tabela associativa (N:N) que conecta usuários aos núcleos familiares com controle de permissão (RBAC).';

-- ----------------------------------------------------------------------------
-- 8. TABELA: accounts (Contas Bancárias, Cartões e Carteiras)
-- ----------------------------------------------------------------------------
CREATE TABLE accounts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) >= 2),
    institution_name    VARCHAR(100), -- Ex: 'Nubank', 'Banco Inter', 'XP Investimentos'
    type                account_type NOT NULL DEFAULT 'checking',
    connection_status   connection_status_type NOT NULL DEFAULT 'manual',
    currency_code       CHAR(3) NOT NULL DEFAULT 'BRL',
    initial_balance     NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    credit_limit        NUMERIC(15, 2) CHECK (credit_limit IS NULL OR credit_limit >= 0),
    last_synced_at      TIMESTAMPTZ,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, name)
);

COMMENT ON TABLE accounts IS 'Contas bancárias, corretoras, cartões de crédito e carteiras físicas da família (1:N com households).';
COMMENT ON COLUMN accounts.initial_balance IS 'Saldo inicial no momento do cadastro. O saldo atual é calculado somando initial_balance + receitas - despesas.';

-- ----------------------------------------------------------------------------
-- 9. TABELA: categories (Categorias de Receitas e Despesas)
-- ----------------------------------------------------------------------------
-- Categorias com household_id IS NULL são categorias globais padrão do sistema.
-- Categorias com household_id preenchido são personalizadas por aquela família.
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id    UUID REFERENCES households(id) ON DELETE CASCADE,
    name            VARCHAR(80) NOT NULL CHECK (char_length(trim(name)) >= 2),
    slug            VARCHAR(80) NOT NULL,
    type            transaction_type NOT NULL,
    color_hex       CHAR(7) NOT NULL DEFAULT '#574238' CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
    icon_name       VARCHAR(50) NOT NULL DEFAULT 'DollarSign',
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Garante que categorias do sistema não conflitem com household_id
    CONSTRAINT chk_system_category_scope CHECK (
        (is_system = TRUE AND household_id IS NULL) OR
        (is_system = FALSE AND household_id IS NOT NULL)
    )
);

-- Índices únicos parciais para evitar nomes duplicados no sistema ou na mesma família
CREATE UNIQUE INDEX uq_categories_system_slug ON categories (slug, type) WHERE household_id IS NULL;
CREATE UNIQUE INDEX uq_categories_household_slug ON categories (household_id, slug, type) WHERE household_id IS NOT NULL;

COMMENT ON TABLE categories IS 'Classificação contábil de lançamentos. Evita repetição de strings e cores na tabela de transações.';

-- ----------------------------------------------------------------------------
-- 10. TABELA: recurring_rules (Regras de Transações Recorrentes / Fixas)
-- ----------------------------------------------------------------------------
CREATE TABLE recurring_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id    UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title           VARCHAR(160) NOT NULL CHECK (char_length(trim(title)) >= 2),
    amount          NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    type            transaction_type NOT NULL,
    payment_method  payment_method_type NOT NULL,
    frequency       recurrence_frequency_type NOT NULL DEFAULT 'monthly',
    day_of_month    SMALLINT CHECK (day_of_month IS NULL OR (day_of_month BETWEEN 1 AND 31)),
    start_date      DATE NOT NULL,
    end_date        DATE CHECK (end_date IS NULL OR end_date >= start_date),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE recurring_rules IS 'Moldes de despesas/receitas fixas (ex: Aluguel, Salário, Assinaturas) que geram transações periódicas.';

-- ----------------------------------------------------------------------------
-- 11. TABELA: transactions (Lançamentos Financeiros Consolidados)
-- ----------------------------------------------------------------------------
CREATE TABLE transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    account_id          UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    category_id         UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    created_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    recurring_rule_id   UUID REFERENCES recurring_rules(id) ON DELETE SET NULL,
    title               VARCHAR(160) NOT NULL CHECK (char_length(trim(title)) >= 1),
    amount              NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    type                transaction_type NOT NULL,
    payment_method      payment_method_type NOT NULL,
    status              transaction_status_type NOT NULL DEFAULT 'confirmed',
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE transactions IS 'Fato contábil central. Cada linha é uma entrada ou saída financeira vinculada a uma conta e categoria.';
COMMENT ON COLUMN transactions.amount IS 'Sempre positivo (> 0). O sinal contábil (+ ou -) é determinado estritamente pela coluna type (income/expense).';

-- ----------------------------------------------------------------------------
-- 12. TABELA: category_budgets (Tetos de Gastos Mensais por Categoria)
-- ----------------------------------------------------------------------------
-- Nota de Normalização (3FN): Não armazenamos a coluna "spent" (valor gasto) aqui!
-- O valor gasto é calculado em tempo real via VIEW somando as transactions daquela
-- categoria no mês, eliminando 100% o risco de dessincronização de dados.
CREATE TABLE category_budgets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    category_id         UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    period_month        DATE NOT NULL CHECK (EXTRACT(DAY FROM period_month) = 1), -- Sempre dia 01 do mês (ex: '2026-10-01')
    limit_amount        NUMERIC(15, 2) NOT NULL CHECK (limit_amount > 0),
    alert_threshold_pct SMALLINT NOT NULL DEFAULT 80 CHECK (alert_threshold_pct BETWEEN 1 AND 100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, category_id, period_month)
);

COMMENT ON TABLE category_budgets IS 'Orçamento preventivo (teto de gastos) definido para uma categoria em um mês específico.';
COMMENT ON COLUMN category_budgets.period_month IS 'Representa a competência mensal, exigindo sempre o dia 1º do mês (ex: 2026-10-01).';

-- ----------------------------------------------------------------------------
-- 13. TABELA: savings_goals (Metas de Poupança & Sonhos da Família)
-- ----------------------------------------------------------------------------
CREATE TABLE savings_goals (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    title               VARCHAR(140) NOT NULL CHECK (char_length(trim(title)) >= 2),
    category_label      VARCHAR(60) NOT NULL DEFAULT 'Sonho', -- Ex: 'Segurança', 'Sonho', 'Equipamentos'
    target_amount       NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
    initial_amount      NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (initial_amount >= 0),
    target_date         DATE,
    color_token         VARCHAR(40) NOT NULL DEFAULT 'text-primary',
    status              goal_status_type NOT NULL DEFAULT 'active',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE savings_goals IS 'Objetivos financeiros de médio/longo prazo (ex: Reserva de Emergência, Viagem em Família).';

-- ----------------------------------------------------------------------------
-- 14. TABELA: savings_goal_contributions (Aportes e Resgates nas Metas)
-- ----------------------------------------------------------------------------
CREATE TABLE savings_goal_contributions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    savings_goal_id     UUID NOT NULL REFERENCES savings_goals(id) ON DELETE CASCADE,
    transaction_id      UUID REFERENCES transactions(id) ON DELETE SET NULL,
    created_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    amount              NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    type                contribution_type NOT NULL DEFAULT 'deposit',
    contributed_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes               VARCHAR(255)
);

COMMENT ON TABLE savings_goal_contributions IS 'Histórico auditável de cada aporte ou retirada feita em uma meta de poupança (1:N com savings_goals).';

-- ----------------------------------------------------------------------------
-- 15. TABELAS DE INVESTIMENTOS: assets & investment_transactions
-- ----------------------------------------------------------------------------
-- Permite ao motor em Rust calcular preço médio, alocação da carteira,
-- rentabilidade e dividendos (estilo Status Invest conforme Requisitos.md).
CREATE TABLE assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker          CITEXT NOT NULL UNIQUE CHECK (char_length(trim(ticker)) BETWEEN 2 AND 15),
    name            VARCHAR(140) NOT NULL,
    asset_class     asset_class_type NOT NULL,
    sector          VARCHAR(100),
    currency_code   CHAR(3) NOT NULL DEFAULT 'BRL',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE assets IS 'Catálogo global de ativos negociáveis (Ações, FIIs, ETFs, Renda Fixa) sem duplicação por usuário.';

CREATE TABLE investment_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id        UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    account_id          UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    asset_id            UUID NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    operation_type      investment_operation_type NOT NULL,
    quantity            NUMERIC(18, 8) NOT NULL CHECK (quantity > 0),
    unit_price          NUMERIC(15, 4) NOT NULL CHECK (unit_price >= 0),
    fees                NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (fees >= 0),
    traded_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes               VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE investment_transactions IS 'Ordens de compra, venda e proventos de ativos da família (N:N histórico entre households e assets).';

-- ----------------------------------------------------------------------------
-- 16. ÍNDICES DE ALTA PERFORMANCE (PRODUÇÃO)
-- ----------------------------------------------------------------------------
-- Otimizam buscas por período, listagens no Dashboard e agregações no Rust.

-- Busca principal de transações por família ordenada cronologicamente (apenas ativas)
CREATE INDEX idx_transactions_household_occurred
    ON transactions (household_id, occurred_at DESC)
    WHERE deleted_at IS NULL;

-- Agregação rápida por categoria e tipo (Gráfico de Rosca e Teto de Gastos)
CREATE INDEX idx_transactions_household_category_type
    ON transactions (household_id, category_id, type, occurred_at)
    WHERE deleted_at IS NULL;

-- Filtro por conta bancária (Conciliação e saldo por conta)
CREATE INDEX idx_transactions_account
    ON transactions (account_id, occurred_at DESC)
    WHERE deleted_at IS NULL;

-- Busca de membros e permissões por usuário
CREATE INDEX idx_household_members_user
    ON household_members (user_id)
    WHERE status = 'active';

-- Histórico de aportes por meta financeira
CREATE INDEX idx_goal_contributions_goal
    ON savings_goal_contributions (savings_goal_id, contributed_at DESC);

-- Carteira de investimentos da família por ativo e data
CREATE INDEX idx_investment_tx_household_asset
    ON investment_transactions (household_id, asset_id, traded_at DESC);

-- ----------------------------------------------------------------------------
-- 17. VIEWS ANALÍTICAS (ZERO REDUNDÂNCIA COM LEITURA SIMPLIFICADA)
-- ----------------------------------------------------------------------------

-- View 1: Consumo de Orçamento por Categoria (substitui coluna redundante "spent")
CREATE OR REPLACE VIEW vw_category_budget_consumption AS
SELECT
    cb.id AS budget_id,
    cb.household_id,
    cb.category_id,
    c.name AS category_name,
    c.color_hex,
    c.icon_name,
    cb.period_month,
    cb.limit_amount,
    COALESCE(SUM(t.amount), 0.00)::NUMERIC(15, 2) AS spent_amount,
    GREATEST(cb.limit_amount - COALESCE(SUM(t.amount), 0.00), 0.00)::NUMERIC(15, 2) AS remaining_amount,
    ROUND((COALESCE(SUM(t.amount), 0.00) / cb.limit_amount) * 100, 1) AS consumed_percentage,
    cb.alert_threshold_pct
FROM category_budgets cb
JOIN categories c ON c.id = cb.category_id
LEFT JOIN transactions t
    ON t.household_id = cb.household_id
    AND t.category_id = cb.category_id
    AND t.type = 'expense'
    AND t.deleted_at IS NULL
    AND date_trunc('month', t.occurred_at) = date_trunc('month', cb.period_month::TIMESTAMPTZ)
GROUP BY
    cb.id, cb.household_id, cb.category_id, c.name, c.color_hex, c.icon_name,
    cb.period_month, cb.limit_amount, cb.alert_threshold_pct;

-- View 2: Progresso Consolidado das Metas de Poupança (substitui coluna mutável "current_amount")
CREATE OR REPLACE VIEW vw_savings_goals_progress AS
SELECT
    sg.id AS goal_id,
    sg.household_id,
    sg.title,
    sg.category_label,
    sg.target_amount,
    sg.initial_amount,
    (
        sg.initial_amount +
        COALESCE(SUM(
            CASE
                WHEN sgc.type = 'deposit' THEN sgc.amount
                WHEN sgc.type = 'withdrawal' THEN -sgc.amount
                ELSE 0
            END
        ), 0.00)
    )::NUMERIC(15, 2) AS current_amount,
    ROUND(
        LEAST(
            100.0,
            ((
                sg.initial_amount +
                COALESCE(SUM(
                    CASE
                        WHEN sgc.type = 'deposit' THEN sgc.amount
                        WHEN sgc.type = 'withdrawal' THEN -sgc.amount
                        ELSE 0
                    END
                ), 0.00)
            ) / sg.target_amount) * 100.0
        ), 1
    ) AS progress_percentage,
    sg.target_date,
    sg.color_token,
    sg.status,
    sg.created_at
FROM savings_goals sg
LEFT JOIN savings_goal_contributions sgc ON sgc.savings_goal_id = sg.id
GROUP BY sg.id;

-- View 3: Saldo Atualizado por Conta Bancária (initial_balance + entradas - saídas)
CREATE OR REPLACE VIEW vw_account_balances AS
SELECT
    a.id AS account_id,
    a.household_id,
    a.name,
    a.institution_name,
    a.type,
    a.connection_status,
    a.initial_balance,
    (
        a.initial_balance +
        COALESCE(SUM(
            CASE
                WHEN t.type = 'income' AND t.status IN ('confirmed', 'received', 'settled') THEN t.amount
                WHEN t.type = 'expense' AND t.status IN ('confirmed', 'settled') THEN -t.amount
                ELSE 0
            END
        ), 0.00)
    )::NUMERIC(15, 2) AS current_balance,
    a.last_synced_at,
    a.is_active
FROM accounts a
LEFT JOIN transactions t
    ON t.account_id = a.id
    AND t.deleted_at IS NULL
GROUP BY a.id;

-- ----------------------------------------------------------------------------
-- 18. TRIGGERS DE UPDATED_AT PARA TODAS AS TABELAS MUTÁVEIS
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_households_updated_at
    BEFORE UPDATE ON households FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_household_members_updated_at
    BEFORE UPDATE ON household_members FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_accounts_updated_at
    BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_recurring_rules_updated_at
    BEFORE UPDATE ON recurring_rules FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_category_budgets_updated_at
    BEFORE UPDATE ON category_budgets FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_savings_goals_updated_at
    BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_assets_updated_at
    BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ----------------------------------------------------------------------------
-- 19. CARGA INICIAL OBRIGATÓRIA: CATEGORIAS GLOBAIS DO SISTEMA
-- ----------------------------------------------------------------------------
INSERT INTO categories (name, slug, type, color_hex, icon_name, is_system) VALUES
    ('Alimentação',       'alimentacao',       'expense', '#3B6750', 'ShoppingBag', TRUE),
    ('Moradia & Contas',  'moradia-contas',    'expense', '#9A4100', 'Home',        TRUE),
    ('Lazer & Bem-estar', 'lazer-bem-estar',   'expense', '#E28743', 'Coffee',      TRUE),
    ('Transporte',        'transporte',        'expense', '#D49B4F', 'Car',         TRUE),
    ('Saúde & Bem-estar', 'saude-bem-estar',   'expense', '#416D56', 'HeartPulse',  TRUE),
    ('Outros',            'outros-despesa',    'expense', '#574238', 'DollarSign',  TRUE),
    ('Salário & Renda',   'salario-renda',     'income',  '#2E5A44', 'Briefcase',   TRUE),
    ('Renda Mensal',      'renda-mensal',      'income',  '#2E5A44', 'Briefcase',   TRUE),
    ('Investimentos',     'investimentos',     'income',  '#805208', 'TrendingUp',  TRUE),
    ('Dividendos',        'dividendos',        'income',  '#805208', 'TrendingUp',  TRUE);

COMMIT;
