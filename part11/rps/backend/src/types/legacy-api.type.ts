export type LegacyApiHistoryRes = {
  data: GameData[];
  cursor: string;
};

export type GameDataType = 'GAME_RESULT';

export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

export type Player = {
  name: string;
  played: Move;
};

export type GameData = {
  type: GameDataType;
  gameId: string;
  time: number;
  playerA: Player;
  playerB: Player;
};
