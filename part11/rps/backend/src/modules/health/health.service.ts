import { FastifyRequest, FastifyReply } from 'fastify';

import type { ClientSSE } from '../../types/sse.type.js';

export class HealthService {
  private clients: Array<ClientSSE> = [];
  private interval: ReturnType<typeof setInterval> | null = null;

  check() {
    return { status: 'ok' };
  }

  liveCheck(req: FastifyRequest, reply: FastifyReply) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };

    reply.raw.writeHead(200, headers);
    reply.raw.write(`data: ${JSON.stringify({ status: 'ok' })}\n\n`);

    const clientId = req.id;
    const newClient = {
      id: clientId,
      response: reply,
    };

    this.clients.push(newClient);
    this.startInterval();

    req.raw.on('close', () => {
      console.log(`${clientId} Connection closed`);
      this.clients = this.clients.filter((client) => client.id !== clientId);
    });
  }

  startInterval() {
    if (this.interval !== null)
      return;

    this.interval = setInterval(() => {
      if (this.clients.length === 0) {
        clearInterval(this.interval ?? undefined);
        this.interval = null;
        return;
      }

      for (let i = 0; i < this.clients.length; ) {
        const client = this.clients[i];
        try {
          client.response.raw.write(`data: ${JSON.stringify({ status: 'ok' })}\n\n`);
          i++;
        } catch (err) {
          console.error(`Failed to write to client ${client.id}:`, err);
          this.clients.splice(i, 1);
        }
      }
    }, 1000);
  }
}
