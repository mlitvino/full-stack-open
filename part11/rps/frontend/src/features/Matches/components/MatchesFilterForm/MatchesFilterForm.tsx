import { useState, type SubmitEvent } from 'react';
import styles from './MatchesFilterForm.module.css';

type MatchesFilterFormProps = {
  active?: boolean;
  onSearch: (playerName: string, date: string) => void;
};

export default function MatchesFilterForm({
  active,
  onSearch,
}: MatchesFilterFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(playerName, date);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button
        type="submit"
        className={active ? styles.submitButtonActive : styles.submitButton}
      >
        Search
      </button>
      <input
        type="text"
        className={styles.input}
        placeholder="Player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <label className={styles.label}>
        Date
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
    </form>
  );
}
