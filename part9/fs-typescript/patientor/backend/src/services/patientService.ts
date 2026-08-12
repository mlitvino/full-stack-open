import { v1 as uuid } from 'uuid';

import patients from "../../data/patients.ts";
import type { Patient, NewPatient, NontSensitivePatientEntry } from "../types.ts";

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const getNonSensitiveEntries = (): NontSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
};
