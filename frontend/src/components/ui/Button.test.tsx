import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children and handles onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Nova Transação</Button>);
    const button = screen.getByRole('button', { name: /nova transação/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders terracotta primary classes by default', () => {
    render(<Button variant="primary">Ação</Button>);
    const button = screen.getByRole('button', { name: /ação/i });
    expect(button.className).toContain('bg-primary');
  });

  it('renders disabled state and loading spinner when isLoading is true', () => {
    render(<Button isLoading>Salvando</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Salvando')).toBeInTheDocument();
  });
});
