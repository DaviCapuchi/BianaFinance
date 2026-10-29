import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewTransactionModal } from './NewTransactionModal';

describe('NewTransactionModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <NewTransactionModal
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.queryByText(/adicionar transação/i)).toBeNull();
  });

  it('renders form fields and handles controlled submission safely', () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();
    render(
      <NewTransactionModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText(/adicionar transação/i)).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/descrição/i);
    const amountInput = screen.getByLabelText(/valor/i);

    fireEvent.change(titleInput, { target: { value: 'Consultoria' } });
    fireEvent.change(amountInput, { target: { value: '2500' } });

    const submitBtn = screen.getByRole('button', { name: /salvar transação/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Consultoria',
        amount: 2500,
      })
    );
    expect(handleClose).toHaveBeenCalled();
  });
});
