
import diagnoses from "../../data/diagnoses.ts";
import type { Diagnose } from "../types.ts";

const getDiagnoses = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getDiagnoses,
};
