import { describe, it, expect } from 'vitest';
import { formatCurrency, formatSignedCurrency, formatPercentage } from './formatters';

describe('Financial Formatters', () => {
  it('formats positive and zero values to BRL currency', () => {
    expect(formatCurrency(4250)).toMatch(/R\$\s*4\.250,00/);
    expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
  });

  it('formats signed currency correctly without duplicate signs', () => {
    expect(formatSignedCurrency(6000, 'income')).toMatch(/\+\s*R\$\s*6\.000,00/);
    expect(formatSignedCurrency(-1750, 'expense')).toMatch(/-\s*R\$\s*1\.750,00/);
    expect(formatSignedCurrency(1750, 'expense')).toMatch(/-\s*R\$\s*1\.750,00/);
  });

  it('formats percentage with optional sign', () => {
    expect(formatPercentage(12)).toBe('+12%');
    expect(formatPercentage(-3)).toBe('-3%');
    expect(formatPercentage(29.1, false)).toBe('29.1%');
  });
});
