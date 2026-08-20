import { parseServerSentEvents } from 'parse-sse';

type SseMessageHandler = (data: string) => void | Promise<void>;
type SseHeaders = Record<string, string>;

type SubscribeOptions = {
  url: string;
  headers?: SseHeaders;
  onMessage: SseMessageHandler;
};

type ConnectionEntry = {
  subscribers: Map<number, SseMessageHandler>;
  abort: AbortController | null;
  running: boolean;
  headers?: SseHeaders;
};

export class SseClientService {
  private readonly connections = new Map<string, ConnectionEntry>();
  private nextSubscriberId = 1;

  constructor(private readonly reconnectDelayMs: number = 3000) {}

  subscribe(options: SubscribeOptions): () => void {
    const { url, headers, onMessage } = options;

    let entry = this.connections.get(url);
    if (!entry) {
      entry = {
        subscribers: new Map<number, SseMessageHandler>(),
        abort: null,
        running: false,
        headers,
      };
      this.connections.set(url, entry);
    }

    if (entry.headers === undefined && headers !== undefined) {
      entry.headers = headers;
    }

    const subscriberId = this.nextSubscriberId++;
    entry.subscribers.set(subscriberId, onMessage);

    if (!entry.running) {
      entry.running = true;
      void this.run(url, entry);
    }

    return () => {
      const existing = this.connections.get(url);
      if (!existing) {
        return;
      }

      existing.subscribers.delete(subscriberId);

      if (existing.subscribers.size === 0) {
        existing.running = false;
        existing.abort?.abort();
        existing.abort = null;
        this.connections.delete(url);
      }
    };
  }

  private async run(url: string, entry: ConnectionEntry): Promise<void> {
    while (entry.running && entry.subscribers.size > 0) {
      try {
        await this.openAndStream(url, entry);
      } catch (error) {
        console.error('Shared SSE client stream failed:', error);
      }

      if (!entry.running || entry.subscribers.size === 0) {
        break;
      }

      await this.delay(this.reconnectDelayMs);
    }

    if (entry.subscribers.size === 0) {
      this.connections.delete(url);
    }
  }

  private async openAndStream(url: string, entry: ConnectionEntry): Promise<void> {
    entry.abort = new AbortController();

    const response = await fetch(url, {
      headers: {
        Accept: 'text/event-stream',
        ...(entry.headers ?? {}),
      },
      signal: entry.abort.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`SSE stream connection failed with status ${response.status}`);
    }

    for await (const event of parseServerSentEvents(response)) {
      if (!entry.running || entry.subscribers.size === 0) {
        break;
      }

      if (event.data.length === 0) {
        continue;
      }

      await this.dispatch(entry, event.data);
    }

    entry.abort = null;
  }

  private async dispatch(entry: ConnectionEntry, data: string): Promise<void> {
    const handlers = [...entry.subscribers.values()];
    if (handlers.length === 0) {
      return;
    }

    const settled = await Promise.allSettled(
      handlers.map(async (handler) => handler(data)),
    );

    for (const result of settled) {
      if (result.status === 'rejected') {
        console.error('SSE subscriber callback failed:', result.reason);
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
