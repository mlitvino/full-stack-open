
import diagnoses from "../../data/diagnoses.ts";
import type { Diagnose } from "../types.ts";

const getDiagnoses = (): Diagnose[] => {
  return diagnoses;
};

const findByCode = (code: string): Diagnose | undefined => {
  return diagnoses.find(d => d.code === code);
};

export default {
  getDiagnoses,
  findByCode,
};
