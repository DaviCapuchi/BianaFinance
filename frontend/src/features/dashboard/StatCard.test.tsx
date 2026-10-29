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
});
