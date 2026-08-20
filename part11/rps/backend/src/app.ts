import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import sensible from '@fastify/sensible';
import { FastifySSEPlugin } from 'fastify-sse-v2';

import { registerDb } from './plugins/db.plugin.js';
import healthController from './modules/health/health.controller.js';
import matchesController from './modules/matches/matches.controller.js';
import leaderboardController from './modules/leaderboard/leaderboard.controller.js';
import servicesPlugin from './plugins/services.plugin.js';
import schedulerPlugin from './plugins/scheduler.plugin.js';

export default function app(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  registerDb(fastify);
  fastify.register(sensible);
  fastify.register(FastifySSEPlugin);
  fastify.register(servicesPlugin);

  if (process.env.TEST !== 'true') {
    fastify.register(schedulerPlugin);
  }

  fastify.register(healthController);
  fastify.register(matchesController);
  fastify.register(leaderboardController);
}
