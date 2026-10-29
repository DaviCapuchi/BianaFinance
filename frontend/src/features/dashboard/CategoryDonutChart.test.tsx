import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryDonutChart } from './CategoryDonutChart';

describe('CategoryDonutChart Component', () => {
  const mockCategories = [
    { category: 'Alimentação' as const, amount: 665, percentage: 38, color: '#422b22' },
    { category: 'Moradia & Contas' as const, amount: 560, percentage: 32, color: '#9a4100' },
  ];

  it('renders category legend with names and percentages', () => {
    render(
      <CategoryDonutChart
        categories={mockCategories}
        totalExpense={1225}
        formattedTotal="R$ 1.225,00"
      />
    );
    expect(screen.getByText('Gastos por Categoria')).toBeInTheDocument();
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByText('Moradia & Contas')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument();
  });

  it('handles zero total expense gracefully without NaN', () => {
    render(
      <CategoryDonutChart
        categories={[]}
        totalExpense={0}
        formattedTotal="R$ 0,00"
      />
    );
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).toBeNull();
  });
});
