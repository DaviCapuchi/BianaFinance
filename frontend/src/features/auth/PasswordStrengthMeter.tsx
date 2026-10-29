import React from 'react';
import { PasswordStrength } from '../../types/auth';
import { cn } from '../../utils/cn';

export interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
  className,
}) => {
  const getBarColor = (index: number) => {
    if (!strength.bars[index]) return 'bg-surface-container';
    if (strength.score <= 1) return 'bg-red-400';
    if (strength.score === 2) return 'bg-amber-400';
    return 'bg-secondary';
  };

  const getLabelColor = () => {
    if (strength.score <= 1) return 'text-red-500';
    if (strength.score === 2) return 'text-amber-500';
    return 'text-secondary';
  };

  return (
    <div className={cn('space-y-1.5 pt-1 text-left', className)}>
      <div className="flex items-center gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              'h-full flex-1 rounded-full transition-colors duration-200',
              getBarColor(index)
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-outline font-medium">{strength.advice}</span>
        <span className={cn('font-bold', getLabelColor())}>
          {strength.label}
        </span>
      </div>
    </div>
  );
};
