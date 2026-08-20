import type { FastifyInstance } from 'fastify';

import { leaderboardQuerySchema } from './dto/leaderboard-query.dto.js';
import { initLeaderboardDecorators } from './decorators/leaderboard.decorator.js';
import { getLeaderboardModule } from './leaderboard.module.js';

export default function leaderboardController(fastify: FastifyInstance) {
  const {
    leaderboardService: service,
    leaderboardSseService,
  } = getLeaderboardModule(
    fastify.services.legacyApiService,
    fastify.services.sseClient,
    fastify.services.sseServer,
    fastify.services.matchesRepository,
  );

  initLeaderboardDecorators(fastify);

  fastify.get(
    '/leaderboard/today',
    () => service.getLeaderboardOfToday(),
  );

  fastify.get(
    '/leaderboard',
    {
      schema: { querystring: leaderboardQuerySchema },
    },
    (req) => {
      const range = req.getLeaderboardQuery();
      return service.getLeaderboard(range);
    },
  );

  fastify.get(
    '/leaderboard/today/live',
    async (req, reply) => leaderboardSseService.liveToday(req, reply),
  );
}
