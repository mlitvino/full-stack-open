import type { FastifyReply, FastifyRequest } from 'fastify';

type SseEndpointContext = {
  clientId: string;
  req: FastifyRequest;
  reply: FastifyReply;
};

type SseEndpointOptions = {
  initialPayload?: (ctx: SseEndpointContext) => Promise<unknown>;
  onClientConnected?: (ctx: SseEndpointContext) => void | Promise<void>;
  onClientDisconnected?: (ctx: { clientId: string }) => void | Promise<void>;
};

type SseClient = {
  id: string;
  response: FastifyReply;
};

type SseEndpointEntry = {
  clients: SseClient[];
  options: SseEndpointOptions;
};

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no',
};

export class SseServerService {
  private readonly endpoints = new Map<string, SseEndpointEntry>();

  registerEndpoint(name: string, options: SseEndpointOptions = {}): void {
    if (this.endpoints.has(name)) {
      return;
    }

    this.endpoints.set(name, {
      clients: [],
      options,
    });
  }

  async subscribe(name: string, req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const endpoint = this.getEndpoint(name);
    const clientId = req.id;
    const context: SseEndpointContext = { clientId, req, reply };

    let initialPayload: unknown;
    if (endpoint.options.initialPayload) {
      initialPayload = await endpoint.options.initialPayload(context);
    }

    reply.hijack();
    reply.raw.writeHead(200, SSE_HEADERS);
    endpoint.clients.push({ id: clientId, response: reply });

    if (endpoint.options.onClientConnected) {
      await endpoint.options.onClientConnected(context);
    }

    if (initialPayload !== undefined) {
      this.writeEvent(reply, initialPayload);
    }

    req.raw.on('close', () => {
      void this.removeClient(name, clientId);
    });
  }

  broadcast(name: string, payload: unknown, eventType?: string): number {
    const endpoint = this.getEndpoint(name);
    if (endpoint.clients.length === 0) {
      return 0;
    }

    const message = this.formatMessage(payload, eventType);
    let sent = 0;

    for (let i = 0; i < endpoint.clients.length; ) {
      const client = endpoint.clients[i];
      try {
        client.response.raw.write(message);
        sent += 1;
        i += 1;
      } catch {
        endpoint.clients.splice(i, 1);
      }
    }

    return sent;
  }

  private async removeClient(name: string, clientId: string): Promise<void> {
    const endpoint = this.endpoints.get(name);
    if (!endpoint) {
      return;
    }

    endpoint.clients = endpoint.clients.filter((client) => client.id !== clientId);

    if (endpoint.options.onClientDisconnected) {
      await endpoint.options.onClientDisconnected({ clientId });
    }
  }

  private getEndpoint(name: string): SseEndpointEntry {
    const endpoint = this.endpoints.get(name);
    if (!endpoint) {
      throw new Error(`SSE endpoint is not registered: ${name}`);
    }

    return endpoint;
  }

  private writeEvent(reply: FastifyReply, payload: unknown, eventType?: string): void {
    reply.raw.write(this.formatMessage(payload, eventType));
  }

  private formatMessage(payload: unknown, eventType?: string): string {
    const eventLine = eventType ? `event: ${eventType}\n` : '';
    return `${eventLine}data: ${JSON.stringify(payload)}\n\n`;
  }
}
