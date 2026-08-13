import express from 'express';

import diagnoseService from '../services/diagnoseService.ts';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (req, res) => {
  const { code } = req.query;

  if (typeof code !== 'string') {
    res.send(diagnoseService.getDiagnoses());
    return;
  }

  const diagnose = diagnoseService.findByCode(code);

  if (!diagnose) {
    res.sendStatus(404);
    return;
  }

  res.send(diagnose);
});

export default diagnosesRouter;
