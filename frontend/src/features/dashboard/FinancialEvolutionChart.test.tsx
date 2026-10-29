import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinancialEvolutionChart } from './FinancialEvolutionChart';

describe('FinancialEvolutionChart Component', () => {
  it('renders title and timeframe buttons', () => {
    const handleTimeframeChange = vi.fn();
    render(
      <FinancialEvolutionChart
        timeframe="mensal"
        onTimeframeChange={handleTimeframeChange}
      />
    );
    expect(screen.getByText('Evolução das Finanças')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /semanal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mensal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anual/i })).toBeInTheDocument();

    const semanaBtn = screen.getByRole('button', { name: /semanal/i });
    fireEvent.click(semanaBtn);
    expect(handleTimeframeChange).toHaveBeenCalledWith('semanal');
  });

  it('renders SVG curves and legend for receitas and despesas', () => {
    render(<FinancialEvolutionChart timeframe="mensal" />);
    expect(screen.getByText('Receitas')).toBeInTheDocument();
    expect(screen.getByText('Despesas')).toBeInTheDocument();
  });
});
