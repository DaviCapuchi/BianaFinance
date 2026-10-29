import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders label and handles value changes safely', () => {
    const handleChange = vi.fn();
    render(<Input label="E-mail" value="" onChange={handleChange} placeholder="seu@email.com" />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText('seu@email.com');
    fireEvent.change(input, { target: { value: 'teste@exemplo.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message when error prop is provided', () => {
    render(<Input label="Senha" error="Senha é obrigatória" value="" onChange={() => {}} />);
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
  });
});
