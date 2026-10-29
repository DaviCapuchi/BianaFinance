import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpPage } from './SignUpPage';

describe('SignUpPage Component', () => {
  it('renders form fields including name, email, password and confirm', () => {
    render(
      <SignUpPage
        onNavigateToSignIn={vi.fn()}
        onRegisterSuccess={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it('validates password mismatch and prevents register when passwords do not match', () => {
    const handleRegister = vi.fn();
    render(
      <SignUpPage
        onNavigateToSignIn={vi.fn()}
        onRegisterSuccess={handleRegister}
      />
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Davi Silva' },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'davi@teste.com' },
    });
    fireEvent.change(screen.getByLabelText(/^senha/i), {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'OutraSenha' },
    });

    const submitBtn = screen.getByRole('button', { name: /criar minha conta/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
    expect(handleRegister).not.toHaveBeenCalled();
  });

  it('submits successfully when fields are valid and terms accepted', () => {
    const handleRegister = vi.fn();
    render(
      <SignUpPage
        onNavigateToSignIn={vi.fn()}
        onRegisterSuccess={handleRegister}
      />
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Davi Silva' },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'davi@teste.com' },
    });
    fireEvent.change(screen.getByLabelText(/^senha/i), {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'Senha@123' },
    });

    const terms = screen.getByRole('checkbox');
    fireEvent.click(terms);

    const submitBtn = screen.getByRole('button', { name: /criar minha conta/i });
    fireEvent.click(submitBtn);

    expect(handleRegister).toHaveBeenCalled();
  });
});
