import { FastifyReply, FastifyRequest } from 'fastify';
import { LegacyApiService } from '../../services/legacy-api.service.js';
import { SseClientService } from '../../services/sse-client.service.js';
import { SseServerService } from '../../services/sse-server.service.js';
import { MatchesService } from './matches.service.js';
import { GameData } from '../../types/legacy-api.type.js';
import { extractGames } from '../../utils/parseData.js';

export class MatchesSseService {
  private readonly latestLiveUrl = 'matches/latest/live';

  private unsubscribeFromLive: (() => void) | null = null;

  constructor(
    private readonly legacyApiService: LegacyApiService,
    private readonly matchesService: MatchesService,
    private readonly sseClient: SseClientService,
    private readonly sseServer: SseServerService,
  ) {}

  getLatestLiveUrl() {
    return this.latestLiveUrl;
  }

  start(): void {
    if (this.unsubscribeFromLive) {
      return;
    }

    this.sseServer.registerEndpoint(this.getLatestLiveUrl(), {
      initialPayload: async () => this.matchesService.getLatest(),
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

  async liveLatest(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.sseServer.subscribe(this.getLatestLiveUrl(), req, reply);
  }

  private broadcastMatchesChanges(games: GameData[]): void {
    const matches = this.matchesService.transformHistory(games);
    if (matches.length === 0) {
      return;
    }

    this.sseServer.broadcast(this.getLatestLiveUrl(), {
      type: 'matches_delta',
      matches,
    });
  }

  private async handleEventData(data: string) {
    try {
      const payload = { parsed: JSON.parse(data) as unknown };
      const games = extractGames(payload);
      if (games.length === 0)
        return;

      this.broadcastMatchesChanges(games);
      await this.matchesService.saveMatches(games);
    } catch {
      return;
    }
  }
};
