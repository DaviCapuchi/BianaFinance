import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePasswordStrength } from './usePasswordStrength';

describe('usePasswordStrength Hook', () => {
  it('returns score 0 for empty password', () => {
    const { result } = renderHook(() => usePasswordStrength(''));
    expect(result.current.score).toBe(0);
    expect(result.current.label).toBe('Muito fraca');
  });

  it('evaluates strong password with 8+ chars, numbers and symbols', () => {
    const { result } = renderHook(() => usePasswordStrength('Senha@2026!'));
    expect(result.current.score).toBeGreaterThanOrEqual(3);
    expect(result.current.bars.filter(Boolean).length).toBeGreaterThanOrEqual(3);
  });
});
