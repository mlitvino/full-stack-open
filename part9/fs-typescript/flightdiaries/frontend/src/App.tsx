import { useEffect, useState } from 'react';
import axios from 'axios';

import diaryService from './services/diaryService';
import { Visibility, Weather, type NonSensitiveDiaryEntry } from './types';

interface BackendError {
  error?: { message: string }[] | string;
}

const App = () => {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [notification, setNotification] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await diaryService.getAll();
      setEntries(data);
    };

    void fetchEntries();
  }, []);

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!weather || !visibility) {
      notify('weather and visibility are required');
      return;
    }

    try {
      const created = await diaryService.create({
        date,
        weather,
        visibility,
        comment,
      });

      setEntries(
        entries.concat({
          id: created.id,
          date: created.date,
          weather: created.weather,
          visibility: created.visibility,
        })
      );

      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as BackendError | undefined;
        const reason = data?.error;

        if (Array.isArray(reason)) {
          notify(reason.map((issue) => issue.message).join(', '));
        } else {
          notify(reason ?? error.message);
        }
      } else {
        notify('Unknown error');
      }
    }
  };

  return (
    <div>
      <h1>Diary entries</h1>

      {notification && <p style={{ color: 'red' }}>{notification}</p>}

      <h2>Add new entry</h2>
      <form onSubmit={(event) => void addEntry(event)}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          weather
          {Object.values(Weather).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          visibility
          {Object.values(Visibility).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Entries</h2>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>
            weather: {entry.weather}
            <br />
            visibility: {entry.visibility}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;
