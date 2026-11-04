import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
  it('renders settings page with tabs and profile form', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Configurações da Conta')).toBeInTheDocument();
    expect(screen.getByText(/perfil & família/i)).toBeInTheDocument();
    expect(screen.getByText(/contas & cartões/i)).toBeInTheDocument();
    expect(screen.getByText(/preferências & alertas/i)).toBeInTheDocument();
    expect(screen.getByText(/segurança & dados/i)).toBeInTheDocument();

    // In default 'perfil' tab
    expect(screen.getByDisplayValue('Davi Siqueira')).toBeInTheDocument();
    expect(screen.getByDisplayValue('davi@biana.finance')).toBeInTheDocument();
  });

  it('switches between settings tabs', () => {
    render(<SettingsPage />);
    const contasTab = screen.getByRole('button', { name: /contas & cartões/i });
    fireEvent.click(contasTab);

    expect(screen.getByText('Instituições & Contas Conectadas')).toBeInTheDocument();
    expect(screen.getByText('Nubank')).toBeInTheDocument();
    expect(screen.getByText('Banco Inter')).toBeInTheDocument();
  });
});
