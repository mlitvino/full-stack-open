import type { GameData } from '../../types/legacy-api.type.js';
import type { MatchesRes, MatchResult } from './dto/matches-res.dto.js';
import { MatchesQuery } from './dto/matches-query.dto.js';

import { defineWinner } from '../../utils/defineWinner.js';
import { findRangeGames } from '../../utils/dateSearch.js';
import { toUtcDayStartMs, minutes } from '../../utils/time.js';

import { CacheService } from '../../services/cache.service.js';
import type { LegacyApiService } from '../../services/legacy-api.service.js';
import type { Repository } from 'typeorm';
import { Match } from '../../repositories/matches.entity.js';

const UPSERT_BATCH_SIZE = 250;

export class MatchesService {
  constructor(
    private readonly legacyApiService: LegacyApiService,
    private readonly cache: CacheService<MatchesRes>,
    private readonly matchesRepository: Repository<Match>,
  ) {}

  async getLatest(): Promise<MatchesRes> {
    const { matches } = await this.getMatches({});
    return { matches: matches.slice(0, 100) };
  }

  async getMatches(filter: MatchesQuery): Promise<MatchesRes> {
    const date: Date = filter.date ?? new Date();
    const dateMs = toUtcDayStartMs(date);
    const cacheKey = `${filter.playerName ?? ''}:${dateMs}:${dateMs}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const dbQuery = this.matchesRepository
      .createQueryBuilder('match')
      .where('match.start_of_day_ms = :dateMs', { dateMs })
      .orderBy('match.played_at_ms', 'DESC');

    if (filter.playerName) {
      dbQuery.andWhere(
        '(match.player_a_name = :playerName OR match.player_b_name = :playerName)',
        { playerName: filter.playerName },
      );
    }

    const storedMatches = await dbQuery.getMany();
    if (storedMatches.length > 0) {
      const res = { matches: this.transformDbResponse(storedMatches) };
      const todayStartMs = toUtcDayStartMs(new Date());
      const ttlMs = dateMs === todayStartMs ? minutes(1) : undefined;
      this.cache.set(cacheKey, res, ttlMs);
      return res;
    }

    const rangeGames = await findRangeGames(this.legacyApiService, dateMs, dateMs);
    const filtered = rangeGames.filter((match) => {
      if (filter.playerName) {
        if (filter.playerName !== match.playerA.name &&
            filter.playerName !== match.playerB.name)
        {
          return false;
        }
      };
      return true;
    });
    await this.saveMatches(filtered);

    const matches = this.transformHistory(filtered);

    const res = {
      matches,
    };

    const todayStartMs = toUtcDayStartMs(new Date());
    const ttlMs = dateMs === todayStartMs ? minutes(1) : undefined;
    this.cache.set(cacheKey, res, ttlMs);

    return res;
  };

  async saveMatches(gameData: GameData[]): Promise<void> {
    if (gameData.length === 0) {
      return;
    }

    const entities = gameData.map((game) => ({
      gameId: game.gameId,
      playedAtMs: game.time,
      startOfDayMs: toUtcDayStartMs(new Date(game.time)),
      playerAName: game.playerA.name,
      playerBName: game.playerB.name,
      playerAMove: game.playerA.played,
      playerBMove: game.playerB.played,
      winner: defineWinner(game.playerA.played, game.playerB.played),
    }));

    for (let i = 0; i < entities.length; i += UPSERT_BATCH_SIZE) {
      const batch = entities.slice(i, i + UPSERT_BATCH_SIZE);
      try {
        await this.matchesRepository.upsert(batch, ['gameId']);
      } catch {
        for (const item of batch) {
          await this.matchesRepository.upsert(item, ['gameId']);
        }
      }
    }
  }

  private transformDbResponse(items: Match[]): MatchResult[] {
    return items.map((item) => ({
      gamdId: item.gameId,
      dateUtc: new Date(item.playedAtMs),
      winner: item.winner,
      playerA: {
        name: item.playerAName,
        played: item.playerAMove,
      },
      playerB: {
        name: item.playerBName,
        played: item.playerBMove,
      },
    }));
  }

  transformHistory(gameData: GameData[]): MatchResult[] {
    const matches: MatchResult[] = [];

    for (const game of gameData) {
      const winner = defineWinner(game.playerA.played, game.playerB.played);

      matches.push({
        gamdId: game.gameId,
        dateUtc: new Date(game.time),
        winner,
        playerA: game.playerA,
        playerB: game.playerB,
      });
    }

    return matches;
  }
}
