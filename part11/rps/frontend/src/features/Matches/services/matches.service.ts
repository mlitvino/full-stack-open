import api from '@/shared/services/api';
import type {
  MatchesRes,
} from '../types/matches.type';

type MatchesSearchParams = {
  playerName?: string;
  date?: string;
};

const latestLiveUrl = '/api/matches/latest/live';

const matchesService = {
  async latest(): Promise<MatchesRes> {
    const res = await api.get<MatchesRes>('/matches/latest');
    return res.data;
  },

  getLatestLiveUrl() {
    return latestLiveUrl;
  },

  async search(params: MatchesSearchParams): Promise<MatchesRes> {
    const query = new URLSearchParams();
    if (params.playerName)
      query.set('playerName', params.playerName);
    if (params.date)
      query.set('date', params.date);

    const res = await api.get<MatchesRes>(`/matches?${query.toString()}`);
    return res.data;
  },
};

export default matchesService;
