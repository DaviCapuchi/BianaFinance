import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { TimeframeOption } from '../../types/finance';
import { cn } from '../../utils/cn';

export interface FinancialEvolutionChartProps {
  timeframe?: TimeframeOption;
  onTimeframeChange?: (timeframe: TimeframeOption) => void;
  className?: string;
}

export const FinancialEvolutionChart: React.FC<FinancialEvolutionChartProps> = ({
  timeframe = 'mensal',
  onTimeframeChange,
  className,
}) => {
  const timeframes: { id: TimeframeOption; label: string }[] = [
    { id: 'semanal', label: 'Semanal' },
    { id: 'mensal', label: 'Mensal' },
    { id: 'anual', label: 'Anual' },
  ];

  const xLabels =
    timeframe === 'semanal'
      ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
      : timeframe === 'anual'
      ? ['2023', '2024', '2025', '2026']
      : ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];

  return (
    <Card
      className={cn(
        'p-6 flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Evolução das Finanças
          </h2>
          <p className="text-xs text-outline mt-0.5">
            Comparativo de receitas vs despesas
          </p>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div className="inline-flex p-1 bg-surface-container rounded-xl gap-1 self-start sm:self-auto">
          {timeframes.map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => onTimeframeChange?.(tf.id)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-outline hover:text-on-surface'
                )}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Chart (Responsive Inline SVG) */}
      <div className="w-full relative mt-2">
        {/* Floating Tooltip */}
        <div className="absolute left-[38%] top-[10%] -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-inverse-surface text-inverse-on-surface text-xs font-medium shadow-lg pointer-events-none z-10">
          <Sparkles className="w-3.5 h-3.5 text-secondary-fixed" />
          <span>Pico Salarial: +R$ 6.000</span>
        </div>

        <svg
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 680 230"
        >
          <defs>
            <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b6750" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b6750" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#9a4100" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#9a4100" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          <line
            stroke="#f8d2c4"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
            x1="30"
            x2="660"
            y1="30"
            y2="30"
          />
          <line
            stroke="#f8d2c4"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
            x1="30"
            x2="660"
            y1="85"
            y2="85"
          />
          <line
            stroke="#f8d2c4"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
            x1="30"
            x2="660"
            y1="140"
            y2="140"
          />
          <line
            stroke="#f8d2c4"
            strokeOpacity="0.6"
            x1="30"
            x2="660"
            y1="195"
            y2="195"
          />

          {/* Income Smooth Area & Curve (Green) */}
          <path
            d="M 50 195 L 50 190 Q 150 185 240 40 T 430 150 T 630 120 L 630 195 Z"
            fill="url(#incomeFill)"
          />
          <path
            d="M 50 190 Q 150 185 240 40 T 430 150 T 630 120"
            fill="none"
            stroke="#3b6750"
            strokeLinecap="round"
            strokeWidth="3.5"
          />

          {/* Expense Smooth Area & Curve (Terracotta) */}
          <path
            d="M 50 195 L 50 170 Q 150 135 240 160 T 430 110 T 630 135 L 630 195 Z"
            fill="url(#expenseFill)"
          />
          <path
            d="M 50 170 Q 150 135 240 160 T 430 110 T 630 135"
            fill="none"
            stroke="#9a4100"
            strokeLinecap="round"
            strokeWidth="3"
          />

          {/* Checkpoints */}
          <circle cx="240" cy="40" fill="#3b6750" r="5.5" />
          <circle cx="240" cy="40" fill="#ffffff" r="2.5" />
          <circle cx="430" cy="110" fill="#9a4100" r="5" />
          <circle cx="430" cy="110" fill="#ffffff" r="2" />

          {/* X-Axis Labels */}
          <text fill="#8a7267" fontSize="11" fontWeight="600" textAnchor="middle" x="50" y="218">
            {xLabels[0]}
          </text>
          <text fill="#8a7267" fontSize="11" fontWeight="600" textAnchor="middle" x="240" y="218">
            {xLabels[1]}
          </text>
          <text fill="#8a7267" fontSize="11" fontWeight="600" textAnchor="middle" x="430" y="218">
            {xLabels[2]}
          </text>
          <text fill="#8a7267" fontSize="11" fontWeight="600" textAnchor="middle" x="630" y="218">
            {xLabels[3]}
          </text>
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-end gap-6 pt-4 border-t border-[rgba(44,24,16,0.06)] mt-4">
        <div className="flex items-center gap-2 text-xs text-on-surface font-semibold">
          <span className="w-3 h-3 rounded-full bg-secondary shrink-0" />
          <span>Receitas</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface font-semibold">
          <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
          <span>Despesas</span>
        </div>
      </div>
    </Card>
  );
};
