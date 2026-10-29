import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  amount: number;
  formattedAmount: string;
  icon: React.ReactNode;
  type: 'balance' | 'income' | 'expense';
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  progressPercentage?: number;
  bankInfo?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  formattedAmount,
  icon,
  type,
  subtitle,
  badgeText,
  badgeIcon,
  progressPercentage,
  bankInfo,
  className,
}) => {
  const isIncome = type === 'income';
  const isBalance = type === 'balance';

  const iconBgStyles = {
    balance: 'bg-surface-container-high text-primary',
    income: 'bg-secondary-container text-secondary',
    expense: 'bg-surface-container text-primary',
  };

  const amountColorStyles = {
    balance: 'text-on-surface',
    income: 'text-secondary',
    expense: 'text-on-surface',
  };

  const badgeVariant = isIncome
    ? 'forest'
    : isBalance
    ? 'terracotta'
    : 'neutral';

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-tactile-hover border-[rgba(44,24,16,0.06)]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-outline">
          {title}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            iconBgStyles[type]
          )}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h2
          className={cn(
            'text-3xl sm:text-4xl font-bold tracking-tight',
            amountColorStyles[type]
          )}
        >
          {formattedAmount}
        </h2>
        {subtitle && (
          <p className="text-xs text-on-surface-variant font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Info or Progress */}
      {progressPercentage !== undefined ? (
        <div className="pt-3 border-t border-[rgba(44,24,16,0.06)] flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-outline font-medium">Meta Mensal</span>
            {badgeText && (
              <Badge variant={badgeVariant}>
                {badgeIcon}
                <span>{badgeText}</span>
              </Badge>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-[rgba(44,24,16,0.06)] flex items-center justify-between text-xs">
          {badgeText && (
            <Badge variant={badgeVariant}>
              {badgeIcon}
              <span>{badgeText}</span>
            </Badge>
          )}

          {bankInfo && (
            <span className="text-outline font-medium truncate ml-auto">
              {bankInfo}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
