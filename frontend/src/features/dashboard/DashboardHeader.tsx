import React from 'react';
import { Plus, Download, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface DashboardHeaderProps {
  userName?: string;
  periodLabel: string;
  onOpenNewTransaction?: () => void;
  onExport?: () => void;
  onPeriodChange?: (period: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Davi',
  periodLabel,
  onOpenNewTransaction,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Olá, {userName} 👋
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Aqui está o resumo da sua saúde financeira este mês.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* Period pill indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-[rgba(44,24,16,0.06)] shadow-xs text-xs font-semibold text-on-surface">
          <Calendar className="w-4 h-4 text-outline" />
          <span>{periodLabel}</span>
        </div>

        {onExport && (
          <Button
            variant="outline"
            size="md"
            onClick={onExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exportar
          </Button>
        )}

        {onOpenNewTransaction && (
          <Button
            variant="primary"
            size="md"
            onClick={onOpenNewTransaction}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova Transação
          </Button>
        )}
      </div>
    </div>
  );
};
