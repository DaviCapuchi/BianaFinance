import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import { Wallet } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders title, amount and badge correctly', () => {
    render(
      <StatCard
        title="Saldo Atual"
        amount={14850}
        formattedAmount="R$ 14.850,00"
        type="balance"
        icon={<Wallet />}
        badgeText="+12% vs set"
        bankInfo="Conta Corrente • Nubank"
      />
    );
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('R$ 14.850,00')).toBeInTheDocument();
    expect(screen.getByText('+12% vs set')).toBeInTheDocument();
    expect(screen.getByText(/Conta Corrente • Nubank/i)).toBeInTheDocument();
  });

  it('renders progress bar in a clean vertical layout without colliding with badge', () => {
    const { container } = render(
      <StatCard
        title="Receitas"
        amount={6000}
        formattedAmount="+ R$ 6.000,00"
        type="income"
        icon={<Wallet />}
        badgeText="100% recebido"
        progressPercentage={100}
      />
    );
    expect(screen.getByText('100% recebido')).toBeInTheDocument();
    expect(screen.getByText('Meta Mensal')).toBeInTheDocument();
    const footer = container.querySelector('div.pt-3.border-t');
    expect(footer?.className).toContain('flex-col');
  });
});
