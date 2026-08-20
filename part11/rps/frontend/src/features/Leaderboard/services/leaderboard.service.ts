import api from '@/shared/services/api';
import type { LeaderboardRes } from '../types/leaderboard.type';

const todayLiveUrl = '/api/leaderboard/today/live';

const leaderboardService = {
  async today(): Promise<LeaderboardRes> {
    const res = await api.get<LeaderboardRes>('/leaderboard/today');
    return res.data;
  },

  getTodayLiveUrl() {
    return todayLiveUrl;
  },

  async range(to: string, from: string): Promise<LeaderboardRes> {
    const res = await api.get<LeaderboardRes>('/leaderboard', {
      params: { to, from },
    });
    return res.data;
  },
};

export default leaderboardService;
