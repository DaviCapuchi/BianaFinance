import React, { useState } from 'react';
import {
  Target,
  PiggyBank,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Home,
  Coffee,
  Car,
  HeartPulse,
} from 'lucide-react';
import { DashboardLayout } from '../features/dashboard/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';

export interface GoalsPageProps {
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
  userName?: string;
}

interface BudgetCategory {
  id: string;
  category: string;
  spent: number;
  limit: number;
  icon: any;
  color: string;
}

interface SavingsGoal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  category: string;
  color: string;
}

const INITIAL_BUDGETS: BudgetCategory[] = [
  {
    id: 'b1',
    category: 'Moradia & Contas',
    spent: 1200,
    limit: 1450,
    icon: Home,
    color: 'bg-primary text-white',
  },
  {
    id: 'b2',
    category: 'Alimentação',
    spent: 180,
    limit: 800,
    icon: ShoppingBag,
    color: 'bg-secondary text-white',
  },
  {
    id: 'b3',
    category: 'Transporte',
    spent: 210,
    limit: 400,
    icon: Car,
    color: 'bg-tertiary text-white',
  },
  {
    id: 'b4',
    category: 'Lazer & Bem-estar',
    spent: 275.5,
    limit: 500,
    icon: Coffee,
    color: 'bg-[#e28743] text-white',
  },
  {
    id: 'b5',
    category: 'Saúde & Bem-estar',
    spent: 94.5,
    limit: 350,
    icon: HeartPulse,
    color: 'bg-[#416d56] text-white',
  },
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'g1',
    title: 'Reserva de Emergência Familiar',
    currentAmount: 30000,
    targetAmount: 36000,
    deadline: 'Dezembro 2026',
    category: 'Segurança',
    color: 'text-secondary',
  },
  {
    id: 'g2',
    title: 'Viagem de Férias em Família',
    currentAmount: 8200,
    targetAmount: 12000,
    deadline: 'Julho 2027',
    category: 'Sonho',
    color: 'text-primary',
  },
  {
    id: 'g3',
    title: 'Troca de Computador de Trabalho',
    currentAmount: 10000,
    targetAmount: 10000,
    deadline: 'Novembro 2026',
    category: 'Equipamentos',
    color: 'text-tertiary',
  },
];

export const GoalsPage: React.FC<GoalsPageProps> = ({
  onLogout,
  onNavigateTab,
  userName = 'Davi',
}) => {
  const [period, setPeriod] = useState('Outubro 2026');
  const [budgets] = useState<BudgetCategory[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form states for new goal
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalGoalsAccumulated = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget) return;

    const target = parseFloat(newGoalTarget);
    const current = parseFloat(newGoalCurrent) || 0;

    const created: SavingsGoal = {
      id: `g-${Date.now()}`,
      title: newGoalTitle,
      targetAmount: target,
      currentAmount: current,
      deadline: newGoalDeadline || '2027',
      category: 'Sonho',
      color: 'text-primary',
    };

    setGoals((prev) => [...prev, created]);
    setIsGoalModalOpen(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalCurrent('');
    setNewGoalDeadline('');
  };

  const handleDepositToGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
          : g
      )
    );

    setIsDepositModalOpen(false);
    setDepositAmount('');
    setSelectedGoal(null);
  };

  return (
    <>
      <DashboardLayout
        activeTab="metas"
        onNavigateTab={onNavigateTab}
        onLogout={onLogout}
        userName={userName}
        periodLabel={period}
        onPeriodChange={setPeriod}
      >
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(44,24,16,0.06)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffecc8] text-xs font-semibold text-tertiary mb-2">
                <PiggyBank className="w-3.5 h-3.5" />
                Planejamento & Prosperidade
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Metas & Orçamentos
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Planejamento preventivo e realização dos sonhos da sua família.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsGoalModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nova Meta
              </Button>
            </div>
          </div>

          {/* Metric Overview Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Orçamento Mensal Total
                </p>
                <p className="text-2xl font-bold text-on-surface mt-1">
                  {formatCurrency(totalBudgetSpent)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-secondary-container-foreground bg-secondary-container px-2 py-0.5 rounded-full font-medium">
                    {Math.round((totalBudgetSpent / totalBudgetLimit) * 100)}% consumido
                  </span>
                  <span className="text-xs text-outline">de {formatCurrency(totalBudgetLimit)}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 text-secondary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Total em Metas Guardado
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatCurrency(totalGoalsAccumulated)}
                </p>
                <span className="text-xs text-tertiary bg-[#ffecc8] px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                  +8.4% guardado este mês
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high/60 text-primary flex items-center justify-center">
                <PiggyBank className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Previsão de Aporte
                </p>
                <p className="text-2xl font-bold text-secondary mt-1">
                  +R$ 1.500,00
                </p>
                <span className="text-xs text-outline inline-block mt-2 font-medium">
                  Agendado para 28/{period.slice(0, 3)}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container text-tertiary flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </Card>
          </section>

          {/* Section 1: Category Budgets (Teto de Gastos) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  Teto de Gastos por Categoria ({period})
                </h2>
                <p className="text-xs text-outline">
                  Monitore seus tetos de despesas para evitar surpresas no final do mês
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {budgets.map((b) => {
                const Icon = b.icon;
                const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                const isNearLimit = pct >= 80;
                const remaining = Math.max(0, b.limit - b.spent);

                return (
                  <Card key={b.id} className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-on-surface">
                            {b.category}
                          </h3>
                          <p className="text-xs text-outline">
                            Limite: {formatCurrency(b.limit)}
                          </p>
                        </div>
                      </div>

                      <Badge variant={isNearLimit ? 'terracotta' : 'forest'}>
                        {pct}%
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isNearLimit ? 'bg-primary' : 'bg-secondary'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-on-surface">
                          {formatCurrency(b.spent)} gasto
                        </span>
                        <span className={isNearLimit ? 'text-primary font-medium' : 'text-outline'}>
                          Resta {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>

                    {isNearLimit && (
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-container-high/40 text-primary text-xs font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Atenção: 80% do limite atingido</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section 2: Savings Goals (Metas de Poupança & Sonhos) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  Metas de Poupança & Sonhos
                </h2>
                <p className="text-xs text-outline">
                  Objetivos de longo prazo estruturados para a segurança do seu lar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                const isComplete = pct >= 100;

                return (
                  <Card key={g.id} className="p-6 flex flex-col justify-between space-y-4 border border-[rgba(44,24,16,0.06)]">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant">
                          {g.category}
                        </span>
                        {isComplete && (
                          <span className="flex items-center gap-1 text-xs text-secondary font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Concluída!
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-on-surface mt-3">
                        {g.title}
                      </h3>
                      <p className="text-xs text-outline mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Prazo estimado: {g.deadline}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-on-surface">
                          {formatCurrency(g.currentAmount)}
                        </span>
                        <span className="text-xs text-outline">
                          alvo: {formatCurrency(g.targetAmount)}
                        </span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-secondary' : 'bg-primary'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-outline pt-1">
                        <span>Progresso</span>
                        <span className="font-bold text-on-surface">{pct}%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[rgba(44,24,16,0.06)]">
                      <Button
                        variant={isComplete ? 'outline' : 'primary'}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedGoal(g);
                          setIsDepositModalOpen(true);
                        }}
                      >
                        {isComplete ? 'Ver Detalhes' : '+ Guardar Dinheiro'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </DashboardLayout>

      {/* Modal Nova Meta */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Criar Nova Meta Financeira"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Nome da Meta"
            placeholder="Ex: Viagem de Final de Ano, Troca de Carro"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valor Alvo (R$)"
              type="number"
              placeholder="15000"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              required
            />
            <Input
              label="Já Guardado (R$)"
              type="number"
              placeholder="0"
              value={newGoalCurrent}
              onChange={(e) => setNewGoalCurrent(e.target.value)}
            />
          </div>

          <Input
            label="Prazo Desejado"
            placeholder="Ex: Dezembro 2027"
            value={newGoalDeadline}
            onChange={(e) => setNewGoalDeadline(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsGoalModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Meta
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Aportar na Meta */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title={`Aportar em "${selectedGoal?.title}"`}
      >
        <form onSubmit={handleDepositToGoal} className="space-y-4">
          <p className="text-xs text-outline">
            Adicione uma quantia economizada diretamente para o saldo desta meta familiar.
          </p>

          <Input
            label="Valor do Aporte (R$)"
            type="number"
            step="0.01"
            placeholder="Ex: 500.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDepositModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Confirmar Aporte
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
