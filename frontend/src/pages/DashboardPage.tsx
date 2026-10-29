import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Sidebar } from '../features/dashboard/Sidebar';
import { DashboardTopNav } from '../features/dashboard/DashboardTopNav';
import { DashboardHeader } from '../features/dashboard/DashboardHeader';
import { StatCard } from '../features/dashboard/StatCard';
import { FinancialEvolutionChart } from '../features/dashboard/FinancialEvolutionChart';
import { CategoryDonutChart } from '../features/dashboard/CategoryDonutChart';
import { TransactionList } from '../features/dashboard/TransactionList';
import { NewTransactionModal } from '../features/dashboard/NewTransactionModal';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency } from '../utils/formatters';

export interface DashboardPageProps {
  onLogout?: () => void;
  userName?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onLogout,
  userName = 'Davi',
}) => {
  const {
    filteredTransactions,
    filter,
    setFilter,
    timeframe,
    setTimeframe,
    period,
    setPeriod,
    summary,
    categoryExpenses,
    addTransaction,
  } = useFinancialData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Fixed Desktop Sidebar */}
      <Sidebar
        activeTab="dashboard"
        onLogout={onLogout}
        user={{ name: userName, plan: 'Plano Familiar Ativo' }}
      />

      {/* Main Container offset by sidebar width (w-72 = 18rem) */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        {/* Sticky Top Navigation */}
        <DashboardTopNav
          periodLabel={period}
          onPeriodChange={setPeriod}
          onOpenNewTransaction={() => setIsModalOpen(true)}
          user={{ name: userName }}
        />

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Greeting & Controls */}
          <DashboardHeader
            userName={userName}
            periodLabel={period}
            onOpenNewTransaction={() => setIsModalOpen(true)}
            onExport={() => alert('Exportando relatório financeiro...')}
          />

          {/* Triad KPI Summary Cards (Grid 3 cols) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Saldo Atual"
              amount={summary.currentBalance}
              formattedAmount={formatCurrency(summary.currentBalance)}
              type="balance"
              icon={<Wallet className="w-5 h-5 text-primary" />}
              badgeText="+12% vs set"
              bankInfo="Conta Corrente • Nubank"
            />

            <StatCard
              title="Receitas (Mês)"
              amount={summary.totalIncomeMonth}
              formattedAmount={`+ ${formatCurrency(summary.totalIncomeMonth)}`}
              type="income"
              icon={<ArrowDownLeft className="w-5 h-5 text-secondary" />}
              progressPercentage={summary.incomeGoalPercentage}
              badgeText="100% recebido"
            />

            <StatCard
              title="Despesas (Mês)"
              amount={summary.totalExpenseMonth}
              formattedAmount={`- ${formatCurrency(summary.totalExpenseMonth)}`}
              type="expense"
              icon={<ArrowUpRight className="w-5 h-5 text-primary" />}
              subtitle={`${summary.incomeCommittedPercentage.toFixed(1)}% da renda comprometida`}
              badgeText={`Poupado: ${formatCurrency(summary.savedAmount)}`}
            />
          </section>

          {/* Central Visualizations: 8 cols (Evolução) + 4 cols (Categorias) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <FinancialEvolutionChart
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>
            <div className="lg:col-span-4">
              <CategoryDonutChart
                categories={categoryExpenses}
                totalExpense={summary.totalExpenseMonth}
                formattedTotal={formatCurrency(summary.totalExpenseMonth)}
              />
            </div>
          </section>

          {/* Recent Transactions List with Chips */}
          <section>
            <TransactionList
              transactions={filteredTransactions}
              activeFilter={filter}
              onFilterChange={setFilter}
              onOpenNewTransaction={() => setIsModalOpen(true)}
            />
          </section>
        </main>
      </div>

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTransaction}
      />
    </div>
  );
};
