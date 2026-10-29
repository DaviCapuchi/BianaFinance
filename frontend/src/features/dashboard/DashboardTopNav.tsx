import React from 'react';
import { Plus, Bell, Search, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface DashboardTopNavProps {
  periodLabel: string;
  onPeriodChange?: (period: string) => void;
  onOpenNewTransaction?: () => void;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  onOpenMobileMenu?: () => void;
}

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  onOpenNewTransaction,
  user = { name: 'Davi' },
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-[rgba(44,24,16,0.06)] px-6 flex items-center justify-between">
      {/* Search Input or Mobile Brand */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-on-surface">Harmonia</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-full max-w-xs px-3 py-1.5 rounded-xl bg-surface-container-low/70 border border-[rgba(44,24,16,0.06)] text-xs text-outline">
          <Search className="w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Buscar transação, categoria..."
            className="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline text-xs"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notificações"
          className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        {onOpenNewTransaction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenNewTransaction}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Nova Transação</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        )}

        <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary/20 shrink-0">
          {(user.name || 'D').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
