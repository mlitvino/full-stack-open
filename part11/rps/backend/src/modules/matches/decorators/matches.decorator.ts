import type { FastifyInstance, FastifyRequest } from 'fastify';
import '@fastify/sensible';

import type { MatchesQuery } from '../dto/matches-query.dto.js';

declare module 'fastify' {
  interface FastifyRequest {
    getMatchesQuery: () => MatchesQuery;
  }
}

export function initMatchesDecorators(fastify: FastifyInstance) {
  fastify.decorateRequest(
    'getMatchesQuery',
    function getMatchesQuery(this: FastifyRequest): MatchesQuery {
      const query = this.query as {
        playerName?: string,
        date?: string,
      };
      const result: MatchesQuery = {};

      if (typeof query.playerName !== 'string' &&
          typeof query.date !== 'string')
      {
        throw fastify.httpErrors.badRequest('Invalid query: specify date or playerName');
      }

      if (typeof query.playerName === 'string') {
        result.playerName = query.playerName;
      }

      if (typeof query.date === 'string') {
        result.date = parseIsoDateUtc(query.date);
      }

      return result;
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
