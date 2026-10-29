export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Alimentação'
  | 'Moradia & Contas'
  | 'Lazer & Bem-estar'
  | 'Transporte'
  | 'Saúde & Bem-estar'
  | 'Renda Mensal'
  | 'Salário & Renda'
  | 'Investimentos'
  | 'Dividendos'
  | 'Outros';

export type PaymentMethod =
  | 'Conta Corrente'
  | 'Cartão Black'
  | 'Cartão de Crédito'
  | 'Débito'
  | 'Pix'
  | 'Corretora'
  | 'Dinheiro';

export type TransactionStatus = 'Confirmado' | 'Recebido' | 'Liquidado' | 'Pendente';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: PaymentMethod;
  date: string;
  status: TransactionStatus;
}

export type TransactionFilter = 'all' | 'income' | 'expense' | 'credit';

export type TimeframeOption = 'semanal' | 'mensal' | 'anual';

export interface FinancialSummary {
  currentBalance: number;
  previousBalanceComparison: number;
  totalIncomeMonth: number;
  incomeGoalPercentage: number;
  incomeAboveGoalPercentage: number;
  totalExpenseMonth: number;
  incomeCommittedPercentage: number;
  savedAmount: number;
}

export interface CategoryExpense {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface EvolutionPoint {
  label: string;
  income: number;
  expense: number;
}
