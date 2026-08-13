import express, { type Request, type Response } from 'express';

import patientService from '../services/patientService.ts';
import type { Entry, EntryWithoutId, NewPatient, Patient } from '../types.ts';
import { errorMiddleware, newPatientParser, newEntryParser } from '../middleware.ts';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

patientsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Patient>) => {
  const patient = patientService.findPatient(req.params.id);

  if (!patient) {
    res.sendStatus(404);
    return;
  }

  res.send(patient);
});


patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

patientsRouter.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry | { error: string }>) => {
    const addedEntry = patientService.addEntry(req.params.id, req.body);

    if (!addedEntry) {
      res.status(404).send({ error: 'patient not found' });
      return;
    }

    res.json(addedEntry);
  }
);

patientsRouter.use(errorMiddleware);

export default patientsRouter;
