import { describe, it, expect } from 'vitest';

describe('Test Environment Setup', () => {
  it('runs tests and has document available in jsdom', () => {
    const el = document.createElement('div');
    el.className = 'bg-surface text-primary';
    document.body.appendChild(el);
    expect(document.body.contains(el)).toBe(true);
  });
});
