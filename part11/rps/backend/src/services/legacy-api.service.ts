import axios from 'axios';

import { config } from '../config.js';
import type { LegacyApiHistoryRes } from '../types/legacy-api.type.js';

const client = axios.create({
  baseURL: config.legacyApi.baseUrl,
  headers: {
    Authorization: `Bearer ${config.legacyApi.apiToken}`,
  },
});

export class LegacyApiService {
  readonly historyLoc = '/history';
  readonly liveLoc = '/live';

  getAutHeader(): string {
    return `Bearer ${config.legacyApi.apiToken}`;
  }

  async getFirst(): Promise<LegacyApiHistoryRes> {
    const response = await client.get<LegacyApiHistoryRes>(this.historyLoc);

    return response.data;
  }

  async getOne(cursor: string): Promise<LegacyApiHistoryRes> {
    const response = await client.get<LegacyApiHistoryRes>(cursor);

    return response.data;
  }

  getLiveUrl(): string {
    const baseUrl = client.defaults.baseURL ?? '';
    return `${baseUrl}${this.liveLoc}`;
  }
}
