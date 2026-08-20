import type { Player } from '../../../types/legacy-api.type.js';
import type { Winner } from '../../../types/matches.type.js';

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
