import { FastifyReply } from 'fastify';

export type ClientSSE = {
  id: string,
  response: FastifyReply,
};
