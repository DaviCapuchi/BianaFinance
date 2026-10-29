import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  it('renders dashboard with greetings, KPIs, charts and opens new transaction modal', () => {
    render(<DashboardPage onLogout={() => {}} />);
    expect(screen.getByText(/olá, davi/i)).toBeInTheDocument();
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('Gastos por Categoria')).toBeInTheDocument();

    const newTxBtns = screen.getAllByRole('button', { name: /nova transação/i });
    fireEvent.click(newTxBtns[0]);
    expect(screen.getByText(/adicionar transação/i)).toBeInTheDocument();
  });
});
