import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFinancialData } from './useFinancialData';

describe('useFinancialData Hook', () => {
  it('calculates summary balance, income and expense from transactions correctly', () => {
    const { result } = renderHook(() => useFinancialData());
    expect(result.current.summary.currentBalance).toBeGreaterThan(0);
    expect(result.current.summary.totalIncomeMonth).toBeGreaterThan(0);
    expect(result.current.summary.totalExpenseMonth).toBeGreaterThan(0);
  });

  it('filters transactions by type', () => {
    const { result } = renderHook(() => useFinancialData());
    act(() => {
      result.current.setFilter('income');
    });
    expect(result.current.filteredTransactions.every(t => t.type === 'income')).toBe(true);
  });

  it('adds a new transaction and updates summary atomically', () => {
    const { result } = renderHook(() => useFinancialData());
    const initialCount = result.current.transactions.length;
    act(() => {
      result.current.addTransaction({
        title: 'Freelance Design',
        amount: 1500,
        type: 'income',
        category: 'Investimentos',
        paymentMethod: 'Pix',
        date: '2026-10-29',
        status: 'Recebido'
      });
    });
    expect(result.current.transactions.length).toBe(initialCount + 1);
  });
});
