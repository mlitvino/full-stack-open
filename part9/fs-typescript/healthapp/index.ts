import express from 'express';
import type { Request, Response } from 'express';
import { calculateBmi, type BmiValues } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
import { calculator, type Operation } from './calculator.ts';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  try {
    const { height, weight } = checkBmiQuery(req);
    const bmi = calculateBmi(height, weight);
    res.send({
      height,
      weight,
      bmi
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Error';
    res.status(400).send({ error: message });
  }
});

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  if ( !value1 || isNaN(Number(value1)) ) {
     return res.status(400).send({ error: '...'});
  }

  const result = calculator(Number(value1), Number(value2), op as Operation);

  return res.send({ result });
});

app.post('/exercises', (req: Request, res: Response) => {
  try {
    const { target, dailyExercises } = checkExercisesBody(req);
    const result = calculateExercises(dailyExercises, target);
    res.send(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown Error';
    res.status(400).send({ error: message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function checkExercisesBody(req: Request) {
  const body: unknown = req.body;

  if (typeof body !== 'object' || body === null) {
    throw new Error('parameters missing');
  }

  if (!('target' in body) || !('daily_exercises' in body)) {
    throw new Error('parameters missing');
  }

  const { target, daily_exercises: dailyExercises } = body as {
    target: unknown,
    daily_exercises: unknown
  };

  const parsedTarget = Number(target);

  if (typeof target !== 'number' && typeof target !== 'string') {
    throw new Error('malformatted parameters');
  }
  if (isNaN(parsedTarget)) {
    throw new Error('malformatted parameters');
  }

  if (!Array.isArray(dailyExercises) || !dailyExercises.every(d => typeof d === 'number')) {
    throw new Error('malformatted parameters');
  }

  return { target: parsedTarget, dailyExercises };
}

function checkBmiQuery(req: Request): BmiValues {
  const { height, weight } = req.query;

  if (!height || !weight) {
    throw new Error('malformatted parameters');
  }

  const parsedHeight = Number(height);
  const parsedWeight = Number(weight);

  if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
    throw new Error('malformatted parameters');
  }

  return { height: parsedHeight, weight: parsedWeight };
}
