import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Root Component', () => {
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
});
