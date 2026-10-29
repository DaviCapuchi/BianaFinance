import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignInPage } from './SignInPage';

describe('SignInPage Component', () => {
  it('renders form inputs and toggles password visibility', () => {
    render(<SignInPage onNavigateToSignUp={vi.fn()} onLoginSuccess={vi.fn()} />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    const passwordInput = screen.getByLabelText(/^senha/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/exibir ou ocultar senha/i);
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('submits form without page reload and invokes onLoginSuccess', () => {
    const handleLoginSuccess = vi.fn();
    render(<SignInPage onNavigateToSignUp={vi.fn()} onLoginSuccess={handleLoginSuccess} />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha/i);

    fireEvent.change(emailInput, { target: { value: 'davi@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345678' } });

    const submitBtn = screen.getByRole('button', { name: /entrar na conta/i });
    fireEvent.click(submitBtn);

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
  });
});
