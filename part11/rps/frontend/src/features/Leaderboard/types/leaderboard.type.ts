export type LeaderboardRow = {
  name: string;
  wins: number;
};

export type LeaderboardRes = {
  from: string;
  to: string;
  leaderboard: LeaderboardRow[];
};

export type LeaderboardLiveRes =
  | LeaderboardRes
  | ({
      type: 'leaderboard_delta';
      leaderboard: LeaderboardRow[];
    });
