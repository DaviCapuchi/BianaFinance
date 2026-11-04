import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionsPage } from './TransactionsPage';

describe('TransactionsPage', () => {
  it('renders transactions page with header, KPIs, and search filter', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Transações & Conciliação')).toBeInTheDocument();
    expect(screen.getByText('Total Receitas')).toBeInTheDocument();
    expect(screen.getByText('Total Despesas')).toBeInTheDocument();
    expect(screen.getByText('Saldo Líquido')).toBeInTheDocument();

    // Check search input
    const searchInput = screen.getByPlaceholderText(/filtrar por descrição/i);
    expect(searchInput).toBeInTheDocument();

    // Check transaction items render
    expect(screen.getByText('Salário - Tech Corp')).toBeInTheDocument();
  });

  it('filters items when typing in search input', () => {
    render(<TransactionsPage />);
    const searchInput = screen.getByPlaceholderText(/filtrar por descrição/i);
    fireEvent.change(searchInput, { target: { value: 'Supermercado' } });

    expect(screen.getByText('Supermercado Pão de Açúcar')).toBeInTheDocument();
    expect(screen.queryByText('Salário - Tech Corp')).not.toBeInTheDocument();
  });

  it('opens new transaction modal when button is clicked', () => {
    render(<TransactionsPage />);
    const newTxBtns = screen.getAllByRole('button', { name: /nova transação/i });
    fireEvent.click(newTxBtns[0]);
    expect(screen.getByText(/adicionar transação/i)).toBeInTheDocument();
  });
});
