import { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import DateRangeForm from '../DateRangeForm/DateRangeForm';
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  const [isLive, setIsLive] = useState(false);
  const { leaderboard, isLoading, error, loadToday, loadRange } = useLeaderboard(isLive);
  const [lastClicked, setLastClicked] = useState<'today' | 'apply'>('today');

  const handleTodayClick = () => {
    setLastClicked('today');
    void loadToday();
  };

  const handleApply = (from: string, to: string) => {
    setIsLive(false);
    setLastClicked('apply');
    void loadRange(from, to);
  };

  return (
    <div>
      <div className={styles.controls}>

        <label
          className={
            isLive ? `${styles.liveToggle} ${styles.liveToggleActive}` : styles.liveToggle
          }
        >
          <input
            type="checkbox"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
          Live
        </label>
        <button
          type="button"
          className={
            lastClicked === 'today' ? styles.todayButtonActive : styles.todayButton
          }
          onClick={handleTodayClick}
        >
          Today
        </button>

        <DateRangeForm onApply={handleApply} active={lastClicked === 'apply'} />
      </div>

      {error ? (
        <div className={styles.error}>
          {error}
        </div>
      ) : (
        (!leaderboard || isLoading) ? (
          <div>
            Loading leaderboard…
          </div>
        ) : leaderboard.length === 0 ? (
          <div>
            No results
          </div>
        ) : (
          <ul className={styles.list}>
            {leaderboard.map((row, index) => (
              <li key={row.name} className={styles.row}>
                <span className={styles.name}>{index + 1}. {row.name}</span>
                <span className={styles.wins}>{row.wins}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};
