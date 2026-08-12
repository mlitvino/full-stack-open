import express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

import patientService from '../services/patientService.ts';
import type { NewPatient, Patient} from '../types.ts';
import { NewPatientSchema } from '../types.ts';

const patientsRouter = express.Router();

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

const newPatientParser = (req: Request, _req: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

patientsRouter.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});


patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

patientsRouter.use(errorMiddleware);

export default patientsRouter;
