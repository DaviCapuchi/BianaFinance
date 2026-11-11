-- ============================================================================
-- BIANA FINANCE - DADOS DE EXEMPLO (SEED) PARA DESENVOLVIMENTO E ESTUDO
-- ============================================================================
-- Este script popula o banco com os mesmos dados exibidos no Frontend
-- (Família Siqueira, Contas, Lançamentos de Outubro/2026, Orçamentos, Metas e Ações).
-- ============================================================================

BEGIN;

-- 1. Criar Usuários (Davi, Mariana e Sofia)
INSERT INTO users (id, full_name, email, password_hash, phone, plan, two_factor_enabled)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'Davi Siqueira',    'davi@biana.finance',    '$2b$10$ExampleHashForDevelopmentOnly1234567890123456', '(11) 98765-4321', 'family_wealth', TRUE),
    ('22222222-2222-4222-8222-222222222222', 'Mariana Siqueira', 'mariana@biana.finance', '$2b$10$ExampleHashForDevelopmentOnly1234567890123456', '(11) 98765-4322', 'family_wealth', TRUE),
    ('33333333-3333-4333-8333-333333333333', 'Sofia Siqueira',   'sofia@biana.finance',   '$2b$10$ExampleHashForDevelopmentOnly1234567890123456', NULL,              'free',          FALSE);

-- 2. Preferências 1:1 do Usuário Principal
INSERT INTO user_preferences (user_id, currency_code, billing_cycle_day, notify_push, notify_email_weekly, notify_budget_alerts, budget_alert_threshold)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'BRL', 1, TRUE, TRUE, TRUE, 80);

-- 3. Criar o Núcleo Familiar (Household)
INSERT INTO households (id, name, owner_id)
VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Família Siqueira', '11111111-1111-4111-8111-111111111111');

-- 4. Vincular Membros à Família (Relacionamento N:N em household_members)
INSERT INTO household_members (household_id, user_id, role, relationship_label, status)
VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'admin',  'Administrador Familiar', 'active'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'admin',  'Cônjuge • Acesso Completo', 'active'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33333333-3333-4333-8333-333333333333', 'viewer', 'Filha • Mesada & Educação', 'active');

-- 5. Criar Contas Bancárias e Carteiras da Família (1:N com households)
INSERT INTO accounts (id, household_id, name, institution_name, type, connection_status, initial_balance, credit_limit, last_synced_at)
VALUES
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Nubank Conta & Reserva', 'Nubank',      'checking',    'connected', 9450.00, NULL,     CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Banco Inter Black',      'Banco Inter', 'credit_card', 'connected', 0.00,    25000.00, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Carteira Física',        NULL,          'cash',        'manual',    350.00,  NULL,     CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Corretora Biana Invest', 'XP / B3',     'investment',  'connected', 200.00,  NULL,     CURRENT_TIMESTAMP - INTERVAL '30 minutes');

-- 6. Criar Regra de Transação Recorrente (Ex: Aluguel Mensal e Salário)
INSERT INTO recurring_rules (id, household_id, account_id, category_id, title, amount, type, payment_method, frequency, day_of_month, start_date)
VALUES
    (
        'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        (SELECT id FROM categories WHERE slug = 'salario-renda' AND is_system = TRUE),
        'Salário - Tech Corp',
        6000.00,
        'income',
        'checking_account',
        'monthly',
        5,
        '2026-01-05'
    ),
    (
        'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        (SELECT id FROM categories WHERE slug = 'moradia-contas' AND is_system = TRUE),
        'Aluguel & Condomínio',
        1200.00,
        'expense',
        'checking_account',
        'monthly',
        10,
        '2026-01-10'
    );

-- 7. Inserir Lançamentos Financeiros (Transactions)
INSERT INTO transactions (household_id, account_id, category_id, created_by_user_id, recurring_rule_id, title, amount, type, payment_method, status, occurred_at)
VALUES
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        (SELECT id FROM categories WHERE slug = 'salario-renda' AND is_system = TRUE),
        '11111111-1111-4111-8111-111111111111',
        'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
        'Salário - Tech Corp',
        6000.00,
        'income',
        'checking_account',
        'received',
        '2026-10-05 09:00:00-03'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
        (SELECT id FROM categories WHERE slug = 'moradia-contas' AND is_system = TRUE),
        '11111111-1111-4111-8111-111111111111',
        'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
        'Aluguel & Condomínio',
        1200.00,
        'expense',
        'checking_account',
        'confirmed',
        '2026-10-10 08:30:00-03'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
        (SELECT id FROM categories WHERE slug = 'investimentos' AND is_system = TRUE),
        '11111111-1111-4111-8111-111111111111',
        NULL,
        'Rendimento CDB',
        340.00,
        'income',
        'brokerage',
        'settled',
        '2026-10-15 18:00:00-03'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
        (SELECT id FROM categories WHERE slug = 'lazer-bem-estar' AND is_system = TRUE),
        '22222222-2222-4222-8222-222222222222',
        NULL,
        'Cinema & Jantar',
        275.50,
        'expense',
        'credit_card',
        'confirmed',
        '2026-10-18 21:00:00-03'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
        (SELECT id FROM categories WHERE slug = 'saude-bem-estar' AND is_system = TRUE),
        '22222222-2222-4222-8222-222222222222',
        NULL,
        'Farmácia Raia',
        94.50,
        'expense',
        'black_card',
        'confirmed',
        '2026-10-22 11:15:00-03'
    ),
    (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
        (SELECT id FROM categories WHERE slug = 'alimentacao' AND is_system = TRUE),
        '11111111-1111-4111-8111-111111111111',
        NULL,
        'Supermercado Pão de Açúcar',
        180.00,
        'expense',
        'black_card',
        'confirmed',
        '2026-10-24 14:20:00-03'
    );

-- 8. Definir Tetos de Gastos por Categoria (Outubro de 2026)
INSERT INTO category_budgets (household_id, category_id, period_month, limit_amount, alert_threshold_pct)
VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (SELECT id FROM categories WHERE slug = 'moradia-contas'  AND is_system = TRUE), '2026-10-01', 1450.00, 80),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (SELECT id FROM categories WHERE slug = 'alimentacao'     AND is_system = TRUE), '2026-10-01', 800.00,  80),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (SELECT id FROM categories WHERE slug = 'transporte'      AND is_system = TRUE), '2026-10-01', 400.00,  80),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (SELECT id FROM categories WHERE slug = 'lazer-bem-estar' AND is_system = TRUE), '2026-10-01', 500.00,  80),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (SELECT id FROM categories WHERE slug = 'saude-bem-estar' AND is_system = TRUE), '2026-10-01', 350.00,  80);

-- 9. Criar Metas de Poupança & Sonhos e Registrar Aportes
INSERT INTO savings_goals (id, household_id, title, category_label, target_amount, initial_amount, target_date, color_token, status)
VALUES
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Reserva de Emergência Familiar',    'Segurança',    36000.00, 28500.00, '2026-12-31', 'text-secondary', 'active'),
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Viagem de Férias em Família',       'Sonho',        12000.00, 8200.00,  '2027-07-01', 'text-primary',   'active'),
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Troca de Computador de Trabalho',   'Equipamentos', 10000.00, 10000.00, '2026-11-01', 'text-tertiary',  'completed');

INSERT INTO savings_goal_contributions (savings_goal_id, created_by_user_id, amount, type, contributed_at, notes)
VALUES
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', '11111111-1111-4111-8111-111111111111', 1500.00, 'deposit', '2026-10-06 10:00:00-03', 'Aporte mensal pós-salário');

-- 10. Cadastrar Ativos da Bolsa (B3) e Operações da Carteira (Módulo Investimentos)
INSERT INTO assets (id, ticker, name, asset_class, sector, currency_code)
VALUES
    ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'WEGE3',  'WEG S.A.',                        'stock', 'Bens Industriais',    'BRL'),
    ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', 'PETR4',  'Petróleo Brasileiro S.A.',        'stock', 'Petróleo e Gás',      'BRL'),
    ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'HGLG11', 'CSHG Logística FII',              'fii',   'Fundo de Tijolo Log', 'BRL'),
    ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee4', 'IVVB11', 'iShares S&P 500 Fundo de Índice', 'etf',   'Internacional EUA',   'BRL');

INSERT INTO investment_transactions (household_id, account_id, asset_id, operation_type, quantity, unit_price, fees, traded_at, notes)
VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'buy',      100, 52.40,  0.00, '2026-09-15 14:30:00-03', 'Compra de lote padrão WEGE3'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'buy',      20,  160.50, 0.00, '2026-09-20 11:10:00-03', 'Aporte mensal em FIIs'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', 'dividend', 20,  1.10,   0.00, '2026-10-14 09:00:00-03', 'Rendimento isento HGLG11');

COMMIT;
