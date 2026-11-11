import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Fastify Server Setup', () => {
  it('should respond to /api/health with status ok', async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('service', 'biana-finance-api');
  });
});
