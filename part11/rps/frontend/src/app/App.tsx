import { useState } from 'react';

import styles from './App.module.css';

import HealthCheck from '@/features/ApiHealth/components/ApiHealth/ApiHealth';
import Leaderboard from '@/features/Leaderboard/components/Leaderboard/Leaderboard';
import Matches from '@/features/Matches/components/Matches/Matches';

type Tab = 'leaderboard' | 'matches';

export default function App() {
  const [tab, setTab] = useState<Tab>('leaderboard');

  return (
    <div className={styles.container}>
      <header className={styles.titleBox}>
        Rock‑Paper‑Scissors League
      </header>

      <main className={styles.content}>
        <section className={styles.panelBox}>
          <div className={styles.panelTabs}>
            <button
              type="button"
              className={
                tab === 'leaderboard' ? styles.tabButtonActive : styles.tabButton
              }
              onClick={() => setTab('leaderboard')}
            >
              Leaderboard
            </button>
            <button
              type="button"
              className={
                tab === 'matches' ? styles.tabButtonActive : styles.tabButton
              }
              onClick={() => setTab('matches')}
            >
              Matches
            </button>
          </div>
          <div className={styles.panelContent}>
            {tab === 'leaderboard' ? <Leaderboard /> : null}
          </div>
          <div className={styles.panelContent}>
            {tab === 'matches' ? <Matches /> : null}
          </div>
        </section>
      </main>
      <HealthCheck />
    </div>
  );
}
