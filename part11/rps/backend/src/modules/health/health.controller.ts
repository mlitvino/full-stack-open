import type { FastifyInstance } from 'fastify';
import { HealthService } from './health.service.js';

export default function healthController(fastify: FastifyInstance) {
  const service = new HealthService();

  fastify.get('/health', () => service.check());

  fastify.get('/health/live',
    (req, reply) => {
      service.liveCheck(req, reply);
    });
}
