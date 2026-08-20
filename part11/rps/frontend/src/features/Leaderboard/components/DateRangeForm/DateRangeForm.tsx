import { useState, type SubmitEvent } from 'react';
import styles from './DateRangeForm.module.css';

export type DateRangeFormProps = {
  active?: boolean;
  onApply: (from: string, to: string) => void;
};

export default function DateRangeForm({
  active = false,
  onApply,
}: DateRangeFormProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply(from, to);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button
        type="submit"
        className={active ? styles.submitButtonActive : styles.submitButton}
      >
        Apply
      </button>

      <label className={styles.label}>
        From
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        To
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={styles.input}
        />
      </label>
    </form>
  );
}
