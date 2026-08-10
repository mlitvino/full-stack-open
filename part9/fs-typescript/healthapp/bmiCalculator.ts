export interface BmiValues {
  height: number,
  weight: number
}

const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments>');
  }
  if (args.length > 4) {
    throw new Error('Too many arguments');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers');
  }

  return { height, weight };
};

export function calculateBmi(height: number, weight: number): string {
  const bmi = weight / (height / 100 * height / 100);

  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi < 25) {
    return 'Normal range';
  }
  if (bmi < 30) {
    return 'Overweight';
  }
  return 'Obese';
}

if (process.argv[1] === import.meta.filename) {
  try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
