import { useMemo } from 'react';
import type { PasswordStrength } from '../types/auth';

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: 'Muito fraca',
        advice: 'Digite pelo menos 8 caracteres',
        bars: [false, false, false, false],
      };
    }

    let score = 0;
    const hasLength = password.length >= 8;
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLength) score++;
    if (hasMixedCase) score++;
    if (hasNumbers) score++;
    if (hasSpecial) score++;

    const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Excelente'];
    const advices = [
      'Digite pelo menos 8 caracteres',
      'Adicione letras maiúsculas e minúsculas',
      'Inclua números para maior segurança',
      'Adicione caracteres especiais (@, #, $, !)',
      'Sua senha é forte e segura!',
    ];

    const label = labels[score];
    const advice = advices[score];
    const bars = [score >= 1, score >= 2, score >= 3, score >= 4];

    return {
      score,
      label,
      advice,
      bars,
    };
  }, [password]);
}
