import type { FastifyReply, FastifyRequest } from 'fastify';
import type { LegacyApiService } from '../../services/legacy-api.service.js';
import type { SseClientService } from '../../services/sse-client.service.js';
import type { SseServerService } from '../../services/sse-server.service.js';
import type { GameData } from '../../types/legacy-api.type.js';
import { LeaderBoardService } from './leaderboard.service.js';
import { extractGames } from '../../utils/parseData.js';

export class LeaderboardSseService {
  private readonly todayLiveUrl = 'leaderboard/today/live';

  private unsubscribeFromLive: (() => void) | null = null;

  constructor(
    private readonly legacyApiService: LegacyApiService,
    private readonly leaderboardService: LeaderBoardService,
    private readonly sseClient: SseClientService,
    private readonly sseServer: SseServerService,
  ) {}

  getTodayLiveUrl() {
    return this.todayLiveUrl;
  }

  start(): void {
    if (this.unsubscribeFromLive)
      return;

    this.sseServer.registerEndpoint(this.getTodayLiveUrl(), {
      initialPayload: async () => this.leaderboardService.getLeaderboardOfToday(),
    });

    const liveUrl = this.legacyApiService.getLiveUrl();
    this.unsubscribeFromLive = this.sseClient.subscribe({
      url: liveUrl,
      headers: {
        Authorization: this.legacyApiService.getAutHeader(),
      },
      onMessage: (data: string) => this.handleEventData(data),
    });
  }

  stop(): void {
    if (this.unsubscribeFromLive) {
      this.unsubscribeFromLive();
      this.unsubscribeFromLive = null;
    }
  }

  async liveToday(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.sseServer.subscribe(this.getTodayLiveUrl(), req, reply);
  }

  private broadcastLeaderboardChanges(games: GameData[]): void {
    const leaderboard = this.leaderboardService.formLeaderboard(games);
    if (leaderboard.length === 0) {
      return;
    }

    this.sseServer.broadcast(this.getTodayLiveUrl(), {
      type: 'leaderboard_delta',
      leaderboard,
    });
  }

  private handleEventData(data: string) {
    try {
      const payload = { parsed: JSON.parse(data) as unknown };
      const games = extractGames(payload);
      if (games.length === 0)
        return;

      this.broadcastLeaderboardChanges(games);
    } catch {
      return;
    }
  }
}
