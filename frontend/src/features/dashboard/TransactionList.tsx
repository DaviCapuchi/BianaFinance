import React from 'react';
import { ArrowRight, Inbox } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Transaction, TransactionFilter } from '../../types/finance';
import { TransactionItem } from './TransactionItem';
import { cn } from '../../utils/cn';

export interface TransactionListProps {
  transactions: Transaction[];
  activeFilter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
  onOpenNewTransaction?: () => void;
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  activeFilter,
  onFilterChange,
  className,
}) => {
  const filterChips: { id: TransactionFilter; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'income', label: 'Entradas' },
    { id: 'expense', label: 'Saídas' },
    { id: 'credit', label: 'Cartão de Crédito' },
  ];

  return (
    <Card className={cn('p-6 flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Transações Recentes
          </h2>
          <p className="text-xs text-outline mt-0.5">
            Últimas movimentações financeiras registradas
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition-colors group self-start sm:self-auto cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" id="filter-chips">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilterChange(chip.id)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer shrink-0 select-none',
                isActive
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-medium'
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Transactions List with Explicit Ternary */}
      <div className="flex flex-col gap-1 mt-1">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-on-surface">
              Nenhuma movimentação encontrada
            </p>
            <p className="text-xs text-outline mt-1 max-w-xs">
              Não encontramos nenhuma transação correspondente ao filtro selecionado.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
