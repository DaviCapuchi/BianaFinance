import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionList } from './TransactionList';
import { Transaction } from '../../types/finance';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Supermercado Pão de Açúcar',
    amount: 180,
    type: 'expense',
    category: 'Alimentação',
    paymentMethod: 'Cartão Black',
    date: '14:20, 24 Out',
    status: 'Confirmado',
  },
  {
    id: '2',
    title: 'Salário - Tech Corp',
    amount: 6000,
    type: 'income',
    category: 'Salário & Renda',
    paymentMethod: 'Conta Corrente',
    date: '09:00, 05 Out',
    status: 'Recebido',
  },
];

describe('TransactionList Component', () => {
  it('renders transactions and allows filtering chips', () => {
    const handleFilterChange = vi.fn();
    render(
      <TransactionList
        transactions={mockTransactions}
        activeFilter="all"
        onFilterChange={handleFilterChange}
      />
    );
    expect(screen.getByText('Supermercado Pão de Açúcar')).toBeInTheDocument();
    expect(screen.getByText('Salário - Tech Corp')).toBeInTheDocument();

    const incomeChip = screen.getByRole('button', { name: /entradas/i });
    fireEvent.click(incomeChip);
    expect(handleFilterChange).toHaveBeenCalledWith('income');
  });

  it('renders clean empty state without displaying literal 0 when list is empty', () => {
    render(
      <TransactionList
        transactions={[]}
        activeFilter="expense"
        onFilterChange={vi.fn()}
      />
    );
    expect(screen.getByText(/nenhuma movimentação encontrada/i)).toBeInTheDocument();
    expect(screen.queryByText(/^0$/)).toBeNull();
  });
});
