export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

export type Winner = 'PlayerA' | 'PlayerB' | 'Tie';

export type Player = {
  name: string;
  played: Move;
};

export type MatchResult = {
  gamdId: string;
  dateUtc: Date;
  winner: Winner;
  playerA: Player;
  playerB: Player,
};

export type MatchesRes = {
  matches: MatchResult[];
};

export type MatchesResLiveRes =
  | MatchesRes
  | ({
      type: 'matches_delta';
      matches: MatchResult[];
    });

