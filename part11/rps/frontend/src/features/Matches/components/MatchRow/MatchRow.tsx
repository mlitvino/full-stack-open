import type { MatchResult, Winner } from '../../types/matches.type';
import styles from './MatchRow.module.css';

type MatchRowProps = {
  match: MatchResult;
};

type PlayerState = 'WIN' | 'TIE' | 'LOSE';

const stateClassMap: Record<PlayerState, string> = {
  WIN: styles.win,
  LOSE: styles.lose,
  TIE: styles.tie,
};

export default function MatchRow({ match }: MatchRowProps) {
  const date = new Date(match.dateUtc).toUTCString();
  const playerAState = getPlayerState(match.winner, 'PlayerA');
  const playerBState = getPlayerState(match.winner, 'PlayerB');

  return (
    <li className={styles.row}>
      <span className={styles.date}>{date}</span>

      <div className={styles.battle}>
        <span className={styles.player}>{match.playerA.name}</span>
        <span className={`${styles.result} ${stateClassMap[playerAState]}`}>
          {playerAState}
        </span>

        <span className={styles.vs}>VS</span>

        <span className={`${styles.result} ${stateClassMap[playerBState]}`}>
          {playerBState}
        </span>
        <span className={styles.player}>{match.playerB.name}</span>
      </div>
    </li>
  );
}

function getPlayerState(winner: Winner, side: 'PlayerA' | 'PlayerB'): PlayerState {
  if (winner === 'Tie') {
    return 'TIE';
  }

  if (winner === 'PlayerA' && winner === side) {
    return 'WIN';
  }

  if (winner === 'PlayerB' && winner === side) {
    return 'WIN';
  }

  return 'LOSE';
}
