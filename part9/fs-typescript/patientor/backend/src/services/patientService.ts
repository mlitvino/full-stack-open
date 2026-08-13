import { v1 as uuid } from 'uuid';

import patients from "../../data/patients.ts";
import type {
  Patient,
  NewPatient,
  NonSensitivePatient,
  Entry,
  EntryWithoutId,
} from "../types.ts";

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findPatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry | undefined => {
  const patient = findPatient(patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
  findPatient,
  addEntry,
};
