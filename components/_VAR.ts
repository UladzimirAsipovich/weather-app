type PositiveNumber = number; // Read as: NOT FLOAT a positive integer starting from zero
type WithPositiveParamsFX = (from?: PositiveNumber, until?: PositiveNumber) => RegExp;

/**
 * Function, which return RegExp, included into yourself,  existence ONLY latins characters WITHOUT all other symbols.
 * @param from {number} NOT FLOAT a positive integer starting from zero
 * @param until {number} NOT FLOAT a positive integer starting from zero
 * @returns RegExp
 */
export const ONLY_ENG_LETTERS_REGEXP: WithPositiveParamsFX = (from: number = 1, until: number = 50) => {
  if (!Number.isInteger(from) || !Number.isFinite(from) || from < 0) throw new Error('@from parameter was expect is finite and positive number');
  if (!Number.isInteger(until) || !Number.isFinite(until) || until < 0) throw new Error('@until parameter was expect is finite and positive number');
  return new RegExp(`^[A-Za-z]{${from},${until}}$`, 'i');
};

export const AvailableCities: string[] = ['Minsk-BY', 'Moscow-RU', 'Bratislava-SK'];