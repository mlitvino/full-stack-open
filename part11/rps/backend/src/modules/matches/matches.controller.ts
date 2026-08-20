import type { FastifyInstance } from 'fastify';

import { initMatchesDecorators } from './decorators/matches.decorator.js';
import { matchesQuerySchema } from './dto/matches-query.dto.js';
import { getMatchesModule } from './matches.module.js';

export default function matchesController(fastify: FastifyInstance) {
  const {
    matchesService: service,
    matchesSseService,
  } = getMatchesModule(
    fastify.services.legacyApiService,
    fastify.services.sseClient,
    fastify.services.sseServer,
    fastify.services.matchesRepository,
  );

  initMatchesDecorators(fastify);

  fastify.get(
    '/matches/latest',
    () => service.getLatest(),
  );

  fastify.get(
    '/matches',
    {
      schema: { querystring: matchesQuerySchema },
    },
    (req) => {
      const filter = req.getMatchesQuery();
      return service.getMatches(filter);
    },
  );

  fastify.get(
    '/matches/latest/live',
    (req, rep) => matchesSseService.liveLatest(req, rep),
  );
}
