import React, { useState } from 'react';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Percent,
  DollarSign,
  ShoppingBag,
  Home,
  Coffee,
  HeartPulse,
} from 'lucide-react';
import { DashboardLayout } from '../features/dashboard/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export interface ReportsPageProps {
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
  userName?: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

const MONTHLY_HISTORY: MonthlyData[] = [
  { month: 'Mai', income: 6000, expense: 1850 },
  { month: 'Jun', income: 6500, expense: 2200 },
  { month: 'Jul', income: 6100, expense: 2100 },
  { month: 'Ago', income: 6300, expense: 1900 },
  { month: 'Set', income: 6000, expense: 2050 },
  { month: 'Out', income: 6000, expense: 1750 },
];

const TOP_EXPENSES = [
  {
    title: 'Aluguel & Condomínio',
    category: 'Moradia & Contas',
    amount: 1200,
    date: '10 Out 2026',
    account: 'Conta Corrente • Nubank',
    pctOfIncome: '20.0%',
    icon: Home,
    color: 'text-primary',
  },
  {
    title: 'Cinema & Jantar com Família',
    category: 'Lazer & Bem-estar',
    amount: 275.5,
    date: '18 Out 2026',
    account: 'Cartão de Crédito',
    pctOfIncome: '4.6%',
    icon: Coffee,
    color: 'text-[#e28743]',
  },
  {
    title: 'Supermercado Mensal Pão de Açúcar',
    category: 'Alimentação',
    amount: 180,
    date: '24 Out 2026',
    account: 'Cartão Black',
    pctOfIncome: '3.0%',
    icon: ShoppingBag,
    color: 'text-secondary',
  },
  {
    title: 'Farmácia Raia (Medicamentos)',
    category: 'Saúde & Bem-estar',
    amount: 94.5,
    date: '22 Out 2026',
    account: 'Cartão Black',
    pctOfIncome: '1.6%',
    icon: HeartPulse,
    color: 'text-secondary',
  },
];

export const ReportsPage: React.FC<ReportsPageProps> = ({
  onLogout,
  onNavigateTab,
  userName = 'Davi',
}) => {
  const [period, setPeriod] = useState('Outubro 2026');
  const [selectedRange, setSelectedRange] = useState<'month' | 'quarter' | 'year'>('month');

  const maxVal = Math.max(...MONTHLY_HISTORY.map((d) => Math.max(d.income, d.expense))) * 1.15;

  const handleExportPDF = () => {
    alert('Relatório executivo em PDF gerado com sucesso!');
  };

  const handleExportCSV = () => {
    const headers = 'Mês,Receitas (R$),Despesas (R$),Saldo Líquido (R$)\n';
    const rows = MONTHLY_HISTORY.map(
      (m) => `${m.month},${m.income},${m.expense},${m.income - m.expense}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${selectedRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      activeTab="relatórios"
      onNavigateTab={onNavigateTab}
      onLogout={onLogout}
      userName={userName}
      periodLabel={period}
      onPeriodChange={setPeriod}
    >
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(44,24,16,0.06)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Módulo de Inteligência & Performance
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Relatórios & Análises
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Visão aprofundada da saúde financeira familiar e projeções de fluxo de caixa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedRange('month')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedRange === 'month'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Mês Atual
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRange('quarter')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedRange === 'quarter'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Últimos 6 Meses
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRange('year')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedRange === 'year'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Ano 2026
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-4 h-4" />}
              >
                CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportPDF}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Taxa de Poupança
                </p>
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-secondary flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-secondary mt-2">70.8%</p>
              <p className="text-xs text-secondary mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +5.4% acima da meta
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Comparativo vs Mês Ant.
                </p>
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-secondary flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-on-surface mt-2">+14.2%</p>
              <p className="text-xs text-secondary mt-1 font-medium">
                R$ 680,00 a mais economizados
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Média Diária de Gastos
                </p>
                <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-on-surface mt-2">R$ 56,45</p>
              <p className="text-xs text-outline mt-1">
                Teto seguro diário: R$ 85,00
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Maior Custo
                </p>
                <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">Moradia</p>
              <p className="text-xs text-on-surface-variant mt-1">
                68.5% do total de despesas
              </p>
            </Card>
          </section>

          {/* Comparative Cashflow Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-base text-on-surface">
                    Evolução Comparativa: Receitas vs Despesas
                  </h2>
                  <p className="text-xs text-outline mt-0.5">
                    Histórico dos últimos 6 meses com fluxo de caixa positivo contínuo
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-secondary">
                    <span className="w-3 h-3 rounded-sm bg-secondary inline-block" />
                    Receitas
                  </span>
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                    Despesas
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 border-b border-[rgba(44,24,16,0.06)]">
                {MONTHLY_HISTORY.map((item) => {
                  const incomeHeightPct = Math.round((item.income / maxVal) * 100);
                  const expenseHeightPct = Math.round((item.expense / maxVal) * 100);

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        {/* Income Bar */}
                        <div
                          style={{ height: `${incomeHeightPct}%` }}
                          className="w-1/2 max-w-[28px] bg-secondary/85 hover:bg-secondary rounded-t-md transition-all relative cursor-pointer"
                          title={`Receitas em ${item.month}: ${formatCurrency(item.income)}`}
                        />
                        {/* Expense Bar */}
                        <div
                          style={{ height: `${expenseHeightPct}%` }}
                          className="w-1/2 max-w-[28px] bg-primary/85 hover:bg-primary rounded-t-md transition-all relative cursor-pointer"
                          title={`Despesas em ${item.month}: ${formatCurrency(item.expense)}`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-outline mt-3 group-hover:text-on-surface transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-outline">
                <span>Média mensal poupada: <strong className="text-secondary font-semibold">R$ 4.200,00</strong></span>
                <span>Projeção anual de superávit: <strong className="text-on-surface font-semibold">R$ 51.000,00</strong></span>
              </div>
            </Card>

            {/* Category Breakdown Donut / Progress */}
            <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-base text-on-surface">
                  Distribuição por Categoria
                </h2>
                <p className="text-xs text-outline mt-0.5">
                  Composição das despesas do mês atual
                </p>

                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        Moradia & Contas
                      </span>
                      <span className="font-bold text-on-surface">68.5% (R$ 1.200)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '68.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e28743]" />
                        Lazer & Bem-estar
                      </span>
                      <span className="font-bold text-on-surface">15.7% (R$ 275,50)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-[#e28743] rounded-full" style={{ width: '15.7%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        Alimentação
                      </span>
                      <span className="font-bold text-on-surface">10.3% (R$ 180,00)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '10.3%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center gap-1.5 text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#416d56]" />
                        Saúde & Bem-estar
                      </span>
                      <span className="font-bold text-on-surface">5.4% (R$ 94,50)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-[#416d56] rounded-full" style={{ width: '5.4%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(44,24,16,0.06)] flex items-center justify-between text-xs">
                <span className="text-outline">Total categorizado:</span>
                <span className="font-bold text-base text-on-surface">{formatCurrency(1750)}</span>
              </div>
            </Card>
          </div>

          {/* Top 5 Expenses & AI Recommendation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 p-0 overflow-hidden">
              <div className="p-5 border-b border-[rgba(44,24,16,0.06)] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-on-surface">
                    Maiores Despesas do Período
                  </h3>
                  <p className="text-xs text-outline">
                    Auditoria dos débitos de maior impacto sobre a renda familiar
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[rgba(44,24,16,0.06)]">
                {TOP_EXPENSES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-surface-container-low/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="font-bold text-xs text-outline w-4">
                          0{idx + 1}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-on-surface truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-outline">
                            {item.account} • {item.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-on-surface tabular-nums">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-outline">
                          {item.pctOfIncome} da renda
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="lg:col-span-4 p-6 bg-gradient-to-br from-surface-container-low to-surface-container border border-primary/20 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-terracotta mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-on-surface">
                  Dica de Inteligência Financeira
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
                  Você poupou <strong>R$ 4.250,00</strong> este mês. Se você alocar 80% dessa liquidez em um investimento de liquidez diária a 100% do CDI, seu rendimento estimado será de <strong>+R$ 41,20</strong> ao mês com segurança total para a família.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(44,24,16,0.06)]">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => alert('Simulação de investimento aberta!')}
                >
                  Simular Alocação de Liquidez
                </Button>
              </div>
            </Card>
          </div>
        </main>
    </DashboardLayout>
  );
};
