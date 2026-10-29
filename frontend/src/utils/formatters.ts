import { TransactionType } from '../types/finance';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Math.abs(value));
}

export function formatSignedCurrency(value: number, type?: TransactionType): string {
  const absFormatted = formatCurrency(Math.abs(value));
  const isIncome = type === 'income' || (type === undefined && value > 0);
  const isExpense = type === 'expense' || (type === undefined && value < 0);

  if (isIncome) {
    return `+ ${absFormatted}`;
  }
  if (isExpense) {
    return `- ${absFormatted}`;
  }
  return absFormatted;
}

export function formatPercentage(value: number, includeSign = true): string {
  const absVal = Math.abs(value);
  const formatted = Number.isInteger(absVal) ? absVal.toString() : absVal.toFixed(1).replace(/\.0$/, '');

  if (!includeSign) {
    return `${formatted}%`;
  }

  if (value > 0) {
    return `+${formatted}%`;
  }
  if (value < 0) {
    return `-${formatted}%`;
  }
  return `${formatted}%`;
}

export function formatDate(dateStr: string): string {
  return dateStr;
}
