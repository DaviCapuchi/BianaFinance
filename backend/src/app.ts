import fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.routes.js';

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  // Habilita comunicação com o frontend (Vite rodando na 5173)
  await app.register(cors, {
    origin: true,
  });

  // Registro de rotas
  await app.register(healthRoutes, { prefix: '/api' });

  return app;
}
