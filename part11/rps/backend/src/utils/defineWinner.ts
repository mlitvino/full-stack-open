import { Winner } from '../types/matches.type.js';
import { Move } from '../types/legacy-api.type.js';

export function defineWinner(
  playerA: Move,
  playerB: Move,
): Winner {
  if (playerA === playerB)
    return 'Tie';

  if ((playerA === 'ROCK' && playerB === 'SCISSORS')
    || (playerA === 'SCISSORS' && playerB === 'PAPER')
    || (playerA === 'PAPER' && playerB === 'ROCK'))
  {
    return 'PlayerA';
  }
  return 'PlayerB';
}
