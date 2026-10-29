import React from 'react';
import { Card } from '../../components/ui/Card';
import { CategoryExpense } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface CategoryDonutChartProps {
  categories: CategoryExpense[];
  totalExpense: number;
  formattedTotal: string;
  className?: string;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
  totalExpense,
  formattedTotal,
  className,
}) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~376.99
  let currentOffset = 0;

  return (
    <Card
      className={cn(
        'p-6 flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Gastos por Categoria
          </h2>
        </div>
        <p className="text-xs text-outline">
          Distribuição total de saídas no mês
        </p>
      </div>

      {/* Donut Chart Container */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Base Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#fff1ec"
            strokeWidth="17"
          />

          {/* Active Category Segments */}
          {totalExpense > 0 &&
            categories.map((cat, idx) => {
              if (cat.percentage <= 0) return null;
              const segmentLength = (cat.percentage / 100) * circumference;
              const dasharray = `${segmentLength} ${circumference}`;
              const dashoffset = -currentOffset;
              currentOffset += segmentLength;

              return (
                <circle
                  key={cat.category || idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth="17"
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-90"
                />
              );
            })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] uppercase tracking-wider text-outline font-semibold">
            Total Gasto
          </span>
          <span className="text-lg sm:text-xl font-bold text-on-surface tracking-tight leading-snug">
            {formattedTotal}
          </span>
          <span
            className={cn(
              'text-[11px] font-semibold mt-0.5',
              totalExpense > 0 ? 'text-secondary' : 'text-outline'
            )}
          >
            {totalExpense > 0 ? 'Dentro do teto' : 'Sem gastos no mês'}
          </span>
        </div>
      </div>

      {/* Categories Detailed Legend */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-[rgba(44,24,16,0.06)]">
        {categories.length === 0 ? (
          <p className="text-xs text-outline text-center py-2">
            Nenhuma categoria registrada
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-surface-container-low transition-colors text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-on-surface font-semibold truncate">
                  {cat.category}
                </span>
                <span className="text-outline text-[11px] shrink-0 font-medium">
                  {cat.percentage}%
                </span>
              </div>
              <span className="text-on-surface font-bold shrink-0 ml-2">
                {formatCurrency(cat.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
