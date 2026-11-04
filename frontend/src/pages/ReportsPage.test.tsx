import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportsPage } from './ReportsPage';

describe('ReportsPage', () => {
  it('renders reports page with intelligence badge, KPIs, and charts', () => {
    render(<ReportsPage />);
    expect(screen.getByText('Relatórios & Análises')).toBeInTheDocument();
    expect(screen.getByText(/módulo de inteligência/i)).toBeInTheDocument();
    expect(screen.getByText('Taxa de Poupança')).toBeInTheDocument();
    expect(screen.getByText('Média Diária de Gastos')).toBeInTheDocument();
    expect(screen.getByText(/evolução comparativa/i)).toBeInTheDocument();
    expect(screen.getByText(/distribuição por categoria/i)).toBeInTheDocument();
    expect(screen.getByText('Maiores Despesas do Período')).toBeInTheDocument();
    expect(screen.getByText('Dica de Inteligência Financeira')).toBeInTheDocument();
  });
});
