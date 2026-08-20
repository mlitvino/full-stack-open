import styles from './Matches.module.css';
import { useMatches } from '../../hooks/useMatches.ts';
import MatchRow from '../MatchRow/MatchRow';
import MatchesFilterForm from '../MatchesFilterForm/MatchesFilterForm.tsx';

import { useState } from 'react';

export default function Matches() {
  const [isLive, setIsLive] = useState(false);
  const { matches, isLoading, error, loadLatest, loadFiltered } = useMatches(isLive);
  const [lastClicked, setLastClicked] = useState<'latest' | 'apply'>('latest');

  const handleSearch = (playerName: string, date: string) => {
    setLastClicked('apply');
    void loadFiltered(playerName, date);
  };

  const handleLatest = () => {
    setLastClicked('latest');
    void loadLatest();
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
            lastClicked === 'latest' ? styles.latestButtonActive : styles.latestButton
          }
          onClick={handleLatest}
        >
          Latest
        </button>

        <MatchesFilterForm onSearch={handleSearch} active={lastClicked === 'apply'} />
      </div>

      {error ? (
        <div className={styles.error}>
          {error}
        </div>
      ) : (
        (!matches || isLoading) ? (
          <div>
            Loading matches...
          </div>
        ) : matches.length === 0 ? (
          <div>
            No results
          </div>
        ) : (
          <ul className={styles.list}>
            {matches.map((match) => (
              <MatchRow key={match.gamdId} match={match} />
            ))}
          </ul>
        )
      )}
    </div>
  );
}
