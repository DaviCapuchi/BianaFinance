import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalsPage } from './GoalsPage';

describe('GoalsPage', () => {
  it('renders budgets and savings goals sections with KPIs', () => {
    render(<GoalsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Metas & Orçamentos' })).toBeInTheDocument();
    expect(screen.getByText('Orçamento Mensal Total')).toBeInTheDocument();
    expect(screen.getByText('Total em Metas Guardado')).toBeInTheDocument();
    expect(screen.getByText(/teto de gastos por categoria/i)).toBeInTheDocument();
    expect(screen.getByText(/metas de poupança & sonhos/i)).toBeInTheDocument();

    // Check pre-existing goal
    expect(screen.getByText('Reserva de Emergência Familiar')).toBeInTheDocument();
  });

  it('opens new goal modal when clicking Nova Meta', () => {
    render(<GoalsPage />);
    const newGoalBtn = screen.getByRole('button', { name: /nova meta/i });
    fireEvent.click(newGoalBtn);
    expect(screen.getByText('Criar Nova Meta Financeira')).toBeInTheDocument();
  });
});
