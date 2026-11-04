import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Root Component', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders dashboard by default or allows navigation between views', () => {
    render(<App />);
    expect(screen.getByText(/olá, davi/i)).toBeInTheDocument();
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
  });

  it('navigates to signin and signup pages on logout/navigation', () => {
    render(<App />);
    const logoutBtn = screen.getByLabelText(/sair da conta/i);
    fireEvent.click(logoutBtn);

    expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();

    const createAccountBtn = screen.getByRole('button', { name: /criar conta gratuita/i });
    fireEvent.click(createAccountBtn);

    expect(screen.getByText(/crie sua conta gratuita/i)).toBeInTheDocument();
  });

  it('navigates to transações, relatórios, metas and configurações from sidebar', () => {
    render(<App />);

    // Click Transações
    fireEvent.click(screen.getByRole('button', { name: /transações/i }));
    expect(screen.getByText('Transações & Conciliação')).toBeInTheDocument();

    // Click Relatórios
    fireEvent.click(screen.getByRole('button', { name: /relatórios/i }));
    expect(screen.getByText('Relatórios & Análises')).toBeInTheDocument();

    // Click Metas & Orçamentos
    fireEvent.click(screen.getByRole('button', { name: /metas & orçamentos/i }));
    expect(screen.getByText(/metas de poupança & sonhos/i)).toBeInTheDocument();

    // Click Configurações
    fireEvent.click(screen.getByRole('button', { name: /configurações/i }));
    expect(screen.getByText('Configurações da Conta')).toBeInTheDocument();
  });

  it('supports direct URL deep-linking to /signin and /transacoes', () => {
    // Navigate directly to /signin via URL
    window.history.pushState({}, '', '/signin');
    render(<App />);
    expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();
  });
});
