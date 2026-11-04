import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar Component', () => {
  it('renders branding and navigation links', () => {
    const handleTabChange = vi.fn();
    render(<Sidebar activeTab="dashboard" onTabChange={handleTabChange} />);
    expect(screen.getByText(/biana finanças/i)).toBeInTheDocument();
    expect(screen.getByAltText(/biana finanças/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/transações/i)).toBeInTheDocument();

    const txButton = screen.getByText(/transações/i);
    fireEvent.click(txButton);
    expect(handleTabChange).toHaveBeenCalledWith('transações');
  });

  it('renders user anchor details', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        user={{ name: 'Davi', plan: 'Plano Familiar Ativo' }}
      />
    );
    expect(screen.getByText('Davi')).toBeInTheDocument();
    expect(screen.getByText('Plano Familiar Ativo')).toBeInTheDocument();
  });

  it('has responsive classes to hide on mobile viewports by default', () => {
    const { container } = render(<Sidebar activeTab="dashboard" />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('hidden');
    expect(aside?.className).toContain('md:flex');
  });

  it('renders open drawer with backdrop and calls onClose when clicking close button or backdrop', () => {
    const handleClose = vi.fn();
    render(<Sidebar activeTab="dashboard" isOpen={true} onClose={handleClose} />);

    const backdrop = screen.getByTestId('sidebar-backdrop');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByLabelText(/fechar barra lateral/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
