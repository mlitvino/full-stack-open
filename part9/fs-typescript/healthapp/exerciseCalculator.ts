interface Result {
  periodLength: number,
  trainingDays: number,
  target: number,
  average: number,
  success: boolean,
  rating: 1 | 2 | 3,
  ratingDescription: string
}

const calculateRating = (percentage: number): 1 | 2 | 3 => {
  if (percentage === 100) {
    return 3;
  }
  if (percentage >= 75) {
    return 2;
  }
  return 1;
};

const ratingMessage = (rating: 1 | 2 | 3): string => {
  switch (rating) {
    case 3:
      return 'wwww';
    case 2:
      return 'almost!';
    case 1:
      return 'nah';
    default:
      throw new Error('wrong rating');
  }
};

export function calculateExercises(days: number[], target: number): Result {
  const trainingDays = days.filter(d => d > 0).length;
  const average = days.reduce((sum, day) => sum + day, 0) / days.length;
  const percentage = (average / target) * 100;
  const rating = calculateRating(percentage);

  return {
    periodLength: days.length,
    trainingDays,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription: ratingMessage(rating)
  };
}

interface ExerciseValues {
  target: number,
  dailyHours: number[]
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const parsedArgs = args.slice(2).map(Number);

  if (parsedArgs.some(isNaN)) {
    throw new Error('Provided values were not numbers');
  }

  const [target, ...dailyHours] = parsedArgs;

  return { target, dailyHours };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, dailyHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

