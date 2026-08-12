import axios from 'axios';

import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from '../types';

const baseUrl = 'http://localhost:3001/api/diaries';

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return data;
};

const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, entry);
  return data;
};

export default { getAll, create };
