import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardTopNav } from './DashboardTopNav';

describe('DashboardTopNav Component', () => {
  it('renders hamburger menu (três risquinhos), logo and app name', () => {
    const handleToggle = vi.fn();
    render(<DashboardTopNav onToggleSidebar={handleToggle} />);

    // Hamburger button
    const toggleBtn = screen.getByLabelText(/abrir ou fechar menu lateral/i);
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);

    // Logo & App Name
    expect(screen.getByAltText(/biana finanças/i)).toBeInTheDocument();
    expect(screen.getByText(/biana finanças/i)).toBeInTheDocument();
  });

  it('handles optional new transaction button and user initials', () => {
    const handleNewTx = vi.fn();
    render(
      <DashboardTopNav
        onOpenNewTransaction={handleNewTx}
        user={{ name: 'Carolina' }}
      />
    );

    const newTxBtn = screen.getByRole('button', { name: /nova transação/i });
    expect(newTxBtn).toBeInTheDocument();
    fireEvent.click(newTxBtn);
    expect(handleNewTx).toHaveBeenCalledTimes(1);

    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
