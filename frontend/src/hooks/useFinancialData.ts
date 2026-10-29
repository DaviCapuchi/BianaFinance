import { useState, useMemo, useCallback } from 'react';
import type {
  Transaction,
  TransactionFilter,
  TimeframeOption,
  FinancialSummary,
  CategoryExpense,
  TransactionCategory,
} from '../types/finance';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Salário - Tech Corp',
    amount: 6000,
    type: 'income',
    category: 'Salário & Renda',
    paymentMethod: 'Conta Corrente',
    date: '09:00, 05 Out',
    status: 'Recebido',
  },
  {
    id: '2',
    title: 'Supermercado Pão de Açúcar',
    amount: 180,
    type: 'expense',
    category: 'Alimentação',
    paymentMethod: 'Cartão Black',
    date: '14:20, 24 Out',
    status: 'Confirmado',
  },
  {
    id: '3',
    title: 'Farmácia Raia',
    amount: 94.5,
    type: 'expense',
    category: 'Saúde & Bem-estar',
    paymentMethod: 'Cartão Black',
    date: '11:15, 22 Out',
    status: 'Confirmado',
  },
  {
    id: '4',
    title: 'Rendimento CDB',
    amount: 340,
    type: 'income',
    category: 'Investimentos',
    paymentMethod: 'Corretora',
    date: '18:00, 15 Out',
    status: 'Liquidado',
  },
  {
    id: '5',
    title: 'Aluguel & Condomínio',
    amount: 1200,
    type: 'expense',
    category: 'Moradia & Contas',
    paymentMethod: 'Conta Corrente',
    date: '08:30, 10 Out',
    status: 'Confirmado',
  },
  {
    id: '6',
    title: 'Cinema & Jantar',
    amount: 275.5,
    type: 'expense',
    category: 'Lazer & Bem-estar',
    paymentMethod: 'Cartão de Crédito',
    date: '21:00, 18 Out',
    status: 'Confirmado',
  },
];

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  'Alimentação': '#3B6750',
  'Moradia & Contas': '#9A4100',
  'Lazer & Bem-estar': '#E28743',
  'Transporte': '#D49B4F',
  'Saúde & Bem-estar': '#416D56',
  'Renda Mensal': '#2E5A44',
  'Salário & Renda': '#2E5A44',
  'Investimentos': '#805208',
  'Dividendos': '#805208',
  'Outros': '#574238',
};

export function useFinancialData(initialData: Transaction[] = INITIAL_TRANSACTIONS) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('mensal');
  const [period, setPeriod] = useState<string>('Outubro 2026');

  const addTransaction = useCallback(
    (newTx: Omit<Transaction, 'id'> & { id?: string }) => {
      const transaction: Transaction = {
        ...newTx,
        id: newTx.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`),
      };
      setTransactions((prev) => [transaction, ...prev]);
    },
    []
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filter === 'all') return true;
      if (filter === 'income') return t.type === 'income';
      if (filter === 'expense') return t.type === 'expense';
      if (filter === 'credit') {
        return (
          t.paymentMethod === 'Cartão de Crédito' ||
          t.paymentMethod === 'Cartão Black'
        );
      }
      return true;
    });
  }, [transactions, filter]);

  const summary: FinancialSummary = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    }

    const baseline = 10000;
    const currentBalance = baseline + income - expense;
    const incomeCommittedPercentage =
      income > 0 ? (expense / income) * 100 : 0;
    const savedAmount = Math.max(0, income - expense);

    return {
      currentBalance,
      previousBalanceComparison: 12,
      totalIncomeMonth: income,
      incomeGoalPercentage: 100,
      incomeAboveGoalPercentage: 12,
      totalExpenseMonth: expense,
      incomeCommittedPercentage,
      savedAmount,
    };
  }, [transactions]);

  const categoryExpenses: CategoryExpense[] = useMemo(() => {
    const expenseMap = new Map<TransactionCategory, number>();
    let totalExpense = 0;

    for (const t of transactions) {
      if (t.type === 'expense') {
        expenseMap.set(
          t.category,
          (expenseMap.get(t.category) || 0) + t.amount
        );
        totalExpense += t.amount;
      }
    }

    const result: CategoryExpense[] = [];
    expenseMap.forEach((amount, category) => {
      const percentage =
        totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      result.push({
        category,
        amount,
        percentage,
        color: CATEGORY_COLORS[category] || '#574238',
      });
    });

    return result.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return {
    transactions,
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
  };
}
