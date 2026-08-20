import { CacheService } from '../../services/cache.service.js';
import type { LegacyApiService } from '../../services/legacy-api.service.js';
import type { SseClientService } from '../../services/sse-client.service.js';
import type { SseServerService } from '../../services/sse-server.service.js';
import type { LeaderboardRes } from './dto/leaderboard-res.dto.js';
import { LeaderBoardService } from './leaderboard.service.js';
import { LeaderboardSseService } from './leaderboardSse.service.js';
import type { Repository } from 'typeorm';
import { Match } from '../../repositories/matches.entity.js';

type LeaderboardModule = {
  cache: CacheService<LeaderboardRes>;
  leaderboardService: LeaderBoardService;
  leaderboardSseService: LeaderboardSseService;
};

let leaderboardModule: LeaderboardModule | null = null;

export function getLeaderboardModule(
  legacyApiService: LegacyApiService,
  sseClient: SseClientService,
  sseServer: SseServerService,
  matchesRepository: Repository<Match>,
): LeaderboardModule {
  if (leaderboardModule) {
    return leaderboardModule;
  }

  const cache = new CacheService<LeaderboardRes>();
  const leaderboardService = new LeaderBoardService(
    legacyApiService,
    cache,
    matchesRepository,
  );
  const leaderboardSseService = new LeaderboardSseService(
    legacyApiService,
    leaderboardService,
    sseClient,
    sseServer,
  );
  leaderboardSseService.start();

  leaderboardModule = {
    cache,
    leaderboardService,
    leaderboardSseService,
  };

  return leaderboardModule;
}
