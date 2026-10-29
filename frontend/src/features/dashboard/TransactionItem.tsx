import React from 'react';
import {
  ShoppingCart,
  Briefcase,
  Pill,
  TrendingUp,
  Home,
  Car,
  Coffee,
  Receipt,
} from 'lucide-react';
import type { Transaction } from '../../types/finance';
import { formatSignedCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface TransactionItemProps {
  transaction: Transaction;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Alimentação': ShoppingCart,
  'Salário & Renda': Briefcase,
  'Renda Mensal': Briefcase,
  'Saúde & Bem-estar': Pill,
  'Investimentos': TrendingUp,
  'Dividendos': TrendingUp,
  'Moradia & Contas': Home,
  'Transporte': Car,
  'Lazer & Bem-estar': Coffee,
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  className,
}) => {
  const isIncome = transaction.type === 'income';
  const IconComponent = CATEGORY_ICONS[transaction.category] || Receipt;

  const iconContainerStyles = isIncome
    ? 'bg-secondary-container text-secondary'
    : 'bg-surface-container-high text-primary';

  return (
    <div
      className={cn(
        'flex items-center justify-between p-3.5 sm:p-4 rounded-xl hover:bg-surface-container-low/70 transition-all duration-150 group border border-transparent hover:border-[rgba(44,24,16,0.04)]',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            'w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-150',
            iconContainerStyles
          )}
        >
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-on-surface truncate">
            {transaction.title}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-outline mt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
              {transaction.category}
            </span>
            <span>•</span>
            <span>{transaction.date}</span>
            <span>•</span>
            <span className="text-on-surface-variant font-medium">
              {transaction.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 ml-4">
        <span
          className={cn(
            'text-sm sm:text-base font-bold tracking-tight',
            isIncome ? 'text-secondary' : 'text-on-surface'
          )}
        >
          {formatSignedCurrency(transaction.amount, transaction.type)}
        </span>
        <span
          className={cn(
            'text-[11px] font-semibold',
            isIncome ? 'text-secondary' : 'text-outline'
          )}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
};
