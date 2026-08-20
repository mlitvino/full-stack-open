import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { LegacyApiService } from '../services/legacy-api.service.js';
import { CacheService } from '../services/cache.service.js';
import { SseClientService } from '../services/sse-client.service.js';
import { SseServerService } from '../services/sse-server.service.js';
import type { MatchesRes } from '../modules/matches/dto/matches-res.dto.js';
import { Match } from '../repositories/matches.entity.js';
import type { Repository } from 'typeorm';

export type AppServices = {
  legacyApiService: LegacyApiService;
  matchesCache: CacheService<MatchesRes>;
  sseClient: SseClientService;
  sseServer: SseServerService;
  matchesRepository: Repository<Match>;
};

declare module 'fastify' {
  interface FastifyInstance {
    services: AppServices;
  }
}

function servicesPlugin(fastify: FastifyInstance) {
  const services: AppServices = {
    legacyApiService: new LegacyApiService(),
    matchesCache: new CacheService<MatchesRes>(),
    sseClient: new SseClientService(),
    sseServer: new SseServerService(),
    matchesRepository: fastify.orm.getRepository(Match),
  };

  fastify.decorate('services', services);
}

export default fp(servicesPlugin, {
  name: 'services-plugin',
});
