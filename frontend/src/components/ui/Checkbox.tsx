import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className,
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-on-surface',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
    >
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          'w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150',
          checked
            ? 'bg-primary border-primary text-white shadow-sm'
            : 'bg-surface-container-lowest border-outline hover:border-primary',
          disabled ? 'pointer-events-none' : ''
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};
