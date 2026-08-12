import express from 'express';

import patientsRouter from './patients.ts';
import diagnosesRouter from './diagnoses.ts';

const router = express.Router();

router.use('/patients', patientsRouter);
router.use('/diagnoses', diagnosesRouter);

export default router;
