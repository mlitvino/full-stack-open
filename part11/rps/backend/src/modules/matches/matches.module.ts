import type { MatchesRes } from './dto/matches-res.dto.js';
import { CacheService } from '../../services/cache.service.js';
import { LegacyApiService } from '../../services/legacy-api.service.js';
import { MatchesService } from './matches.service.js';
import { MatchesSseService } from './matchesSse.service.js';
import { SseClientService } from '../../services/sse-client.service.js';
import { SseServerService } from '../../services/sse-server.service.js';
import type { Repository } from 'typeorm';
import { Match } from '../../repositories/matches.entity.js';

type MatchesModule = {
  cache: CacheService<MatchesRes>;
  matchesService: MatchesService;
  matchesSseService: MatchesSseService;
};

let matchesModule: MatchesModule | null = null;

export function getMatchesModule(
  legacyApiService: LegacyApiService,
  sseClient: SseClientService,
  sseServer: SseServerService,
  matchesRepository: Repository<Match>,
): MatchesModule {
  if (matchesModule) {
    return matchesModule;
  }

  const cache = new CacheService<MatchesRes>();
  const matchesService = new MatchesService(
    legacyApiService,
    cache,
    matchesRepository,
  );
  const matchesSseService = new MatchesSseService(
    legacyApiService,
    matchesService,
    sseClient,
    sseServer,
  );
  matchesSseService.start();

  matchesModule = {
    cache,
    matchesService,
    matchesSseService,
  };

  return matchesModule;
};
