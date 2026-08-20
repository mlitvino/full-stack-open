import type { FastifyInstance, FastifyRequest } from 'fastify';
import '@fastify/sensible';
import type { LeaderboardQuery } from '../dto/leaderboard-query.dto.js';

declare module 'fastify' {
  interface FastifyRequest {
    getLeaderboardQuery: () => LeaderboardQuery;
  }
}

export function initLeaderboardDecorators(fastify: FastifyInstance) {
  fastify.decorateRequest(
    'getLeaderboardQuery',
    function getLeaderboardQuery(this: FastifyRequest): LeaderboardQuery {
      const query = this.query as {
        date?: string;
        from?: string;
        to?: string;
      };

      if (typeof query.date === 'string'
          && (typeof query.from === 'string' && typeof query.to === 'string')) {
        throw fastify.httpErrors.badRequest('Invalid leaderboard query: define date Or from And to');
      }

      if (typeof query.date === 'string') {
        const d = parseIsoDateUtc(query.date);
        return { from: d, to: d };
      }

      if (typeof query.from === 'string' && typeof query.to === 'string') {
        const from = parseIsoDateUtc(query.from);
        const to = parseIsoDateUtc(query.to);
        if (from > to) {
          throw fastify.httpErrors.badRequest('Invalid leaderboard query: "from" must be on or before "to"');
        }
        return { from, to };
      }

      throw fastify.httpErrors.badRequest('Invalid leaderboard query: define date Or from And to');
    },
  );

  function parseIsoDateUtc(str: string): Date {
    const date = new Date(`${str}T00:00:00.000Z`);
    if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== str) {
      throw fastify.httpErrors.badRequest(`Invalid date format: "${str}"`);
    }
    return date;
  }
}
