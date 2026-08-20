import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifySchedule from '@fastify/schedule';
import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';

import { toUtcDayStartMs, days } from '../utils/time.js';
import { findRangeGames } from '../utils/dateSearch.js';
import { CacheService } from '../services/cache.service.js';
import { MatchesService } from '../modules/matches/matches.service.js';

async function schedulerPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifySchedule);

  fastify.ready(async () => {
    const matchesService = new MatchesService(
      fastify.services.legacyApiService,
      new CacheService(),
      fastify.services.matchesRepository,
    );

    const todayStartMs = toUtcDayStartMs(new Date());
    const task = new AsyncTask(
      'fetch-legacy-api-games',
      async () => {
        const threeDaysAgoStartMs = todayStartMs - days(2);

        const games = await findRangeGames(
          fastify.services.legacyApiService,
          threeDaysAgoStartMs,
          todayStartMs,
        );

        await matchesService.saveMatches(games);
      },
      (err) => {
        fastify.log.error({ err }, 'scheduled legacy API poll failed');
      },
    );

    const job = new SimpleIntervalJob({ days: 3 }, task);
    fastify.scheduler.addSimpleIntervalJob(job);
    const initGames = await findRangeGames(
      fastify.services.legacyApiService,
      todayStartMs,
      todayStartMs,
    );
    await matchesService.saveMatches(initGames);
  });
}

export default fp(schedulerPlugin, {
  name: 'scheduler-plugin',
});
