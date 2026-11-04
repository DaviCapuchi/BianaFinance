import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ShoppingBag,
  Home,
  Coffee,
  Car,
  HeartPulse,
  Briefcase,
  DollarSign,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '../features/dashboard/DashboardLayout';
import { NewTransactionModal } from '../features/dashboard/NewTransactionModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency } from '../utils/formatters';
import type { Transaction, TransactionCategory } from '../types/finance';

export interface TransactionsPageProps {
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
  userName?: string;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onLogout,
  onNavigateTab,
  userName = 'Davi',
}) => {
  const {
    transactions,
    summary,
    period,
    setPeriod,
    addTransaction,
  } = useFinancialData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionList, setTransactionList] = useState<Transaction[]>(transactions);

  // Sync if initial transactions change
  React.useEffect(() => {
    setTransactionList(transactions);
  }, [transactions]);

  const handleAddTransaction = (newTx: Parameters<typeof addTransaction>[0]) => {
    addTransaction(newTx);
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    setTransactionList((prev) => [created, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionList((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredItems = useMemo(() => {
    return transactionList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === 'all' ? true : item.type === selectedType;

      const matchesCategory =
        selectedCategory === 'all' ? true : item.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactionList, searchQuery, selectedType, selectedCategory]);

  const getCategoryIcon = (category: TransactionCategory) => {
    switch (category) {
      case 'Alimentação':
        return <ShoppingBag className="w-4 h-4 text-secondary" />;
      case 'Moradia & Contas':
        return <Home className="w-4 h-4 text-primary" />;
      case 'Lazer & Bem-estar':
        return <Coffee className="w-4 h-4 text-[#e28743]" />;
      case 'Transporte':
        return <Car className="w-4 h-4 text-tertiary" />;
      case 'Saúde & Bem-estar':
        return <HeartPulse className="w-4 h-4 text-secondary" />;
      case 'Salário & Renda':
      case 'Renda Mensal':
        return <Briefcase className="w-4 h-4 text-secondary" />;
      case 'Investimentos':
      case 'Dividendos':
        return <TrendingUp className="w-4 h-4 text-tertiary" />;
      default:
        return <DollarSign className="w-4 h-4 text-outline" />;
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Título,Tipo,Categoria,Forma de Pagamento,Data,Status,Valor (R$)\n';
    const rows = filteredItems
      .map(
        (t) =>
          `"${t.id}","${t.title}","${t.type}","${t.category}","${t.paymentMethod}","${t.date}","${t.status}",${t.amount}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes-${period.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashboardLayout
        activeTab="transações"
        onNavigateTab={onNavigateTab}
        onLogout={onLogout}
        userName={userName}
        periodLabel={period}
        onPeriodChange={setPeriod}
        onOpenNewTransaction={() => setIsModalOpen(true)}
      >
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(44,24,16,0.06)]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Transações & Conciliação
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Acompanhe e categorize cada entrada e saída do seu patrimônio familiar.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Exportar CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nova Transação
              </Button>
            </div>
          </div>

          {/* KPI Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Total Receitas
                </p>
                <p className="text-2xl font-bold text-secondary mt-1">
                  +{formatCurrency(summary.totalIncomeMonth)}
                </p>
                <span className="text-xs text-secondary-container-foreground bg-secondary-container px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                  100% recebido
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 text-secondary flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Total Despesas
                </p>
                <p className="text-2xl font-bold text-on-surface mt-1">
                  -{formatCurrency(summary.totalExpenseMonth)}
                </p>
                <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                  {summary.incomeCommittedPercentage.toFixed(1)}% da renda
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high/60 text-primary flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Saldo Líquido
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatCurrency(summary.currentBalance)}
                </p>
                <span className="text-xs text-tertiary bg-[#ffecc8] px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                  Superávit ativo
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container text-tertiary flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </Card>
          </section>

          {/* Filters & Search Toolbar */}
          <Card className="p-4 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por descrição, categoria ou forma de pagamento..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-lowest border border-[rgba(44,24,16,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface placeholder:text-outline"
                />
              </div>

              {/* Type Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl self-start lg:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === 'all'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Todas ({transactionList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('income')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === 'income'
                      ? 'bg-surface-container-lowest text-secondary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Entradas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('expense')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === 'expense'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Saídas
                </button>
              </div>

              {/* Category Filter Select */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-outline" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-surface-container-lowest border border-[rgba(44,24,16,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia & Contas">Moradia & Contas</option>
                  <option value="Lazer & Bem-estar">Lazer & Bem-estar</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                  <option value="Salário & Renda">Salário & Renda</option>
                  <option value="Investimentos">Investimentos</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Transactions Feed / Table */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[rgba(44,24,16,0.06)] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-on-surface">
                  Lançamentos ({filteredItems.length})
                </h2>
                <p className="text-xs text-outline">
                  Exibindo registros ordenados cronologicamente
                </p>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container mx-auto flex items-center justify-center text-outline">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base text-on-surface">
                  Nenhuma transação encontrada
                </h3>
                <p className="text-xs text-outline max-w-sm mx-auto">
                  Tente alterar seus termos de busca ou filtros aplicados para visualizar outros registros.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(44,24,16,0.06)]">
                {filteredItems.map((tx) => {
                  const isIncome = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      className="p-4 sm:px-6 hover:bg-surface-container-low/40 transition-colors flex items-center justify-between gap-4"
                    >
                      {/* Left side: Icon & Title */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 border border-[rgba(44,24,16,0.04)]">
                          {getCategoryIcon(tx.category)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-on-surface truncate">
                            {tx.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-outline">
                            <span className="font-medium text-on-surface-variant">
                              {tx.category}
                            </span>
                            <span>•</span>
                            <span>{tx.paymentMethod}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Badge, Amount & Actions */}
                      <div className="flex items-center gap-4 shrink-0">
                        <Badge
                          variant={
                            tx.status === 'Confirmado' || tx.status === 'Recebido'
                              ? 'forest'
                              : 'surface'
                          }
                          className="hidden sm:inline-flex"
                        >
                          {tx.status}
                        </Badge>

                        <div className="text-right">
                          <p
                            className={`font-bold text-sm sm:text-base tabular-nums ${
                              isIncome ? 'text-secondary' : 'text-on-surface'
                            }`}
                          >
                            {isIncome ? '+ ' : '- '}
                            {formatCurrency(tx.amount)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          title="Excluir lançamento"
                          className="p-1.5 text-outline hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </main>
      </DashboardLayout>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </>
  );
};
