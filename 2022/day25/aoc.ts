import { reverseKeyValues, sumNumbers } from "../util/helpers";
import { readInputs } from "../util/input";

const [input, testInput] = readInputs(__dirname);

const snafuMapping = {
  "0": 0,
  "1": 1,
  "2": 2,
  "-": -1,
  "=": -2
} as const;

const reverseSnafuMapping = reverseKeyValues(snafuMapping);

type SnafuDigit = keyof typeof snafuMapping;

const parseInput = (input: string[]): number[] => input.map(row =>
  row
    .split("")
    .reverse()
    .map(digit => snafuMapping[digit as SnafuDigit])
    .reduce(([sum, multiplier], digit) => [sum + digit * multiplier, multiplier * 5], [0, 1])[0]
);

const decimalToSnafu = (decimal: number) => {
  const starting = Math.pow(5, 30);
  const snafuDigits: number[] = [];

  let firstDigit = false;
  for (let multiplier = starting; multiplier >= 1; multiplier = Math.floor(multiplier / 5)) {
    const snafuValue = Math.floor(decimal / multiplier);
    firstDigit = firstDigit || snafuValue > 0;

    if (firstDigit) {
      snafuDigits.unshift(snafuValue);
      decimal = decimal % multiplier;
    }
  }

  let leadingOne = false;
  snafuDigits.forEach((digit, i) => {
    if (digit > 2) {
      if (i === snafuDigits.length - 1) {
        leadingOne = true;
      } else {
        snafuDigits[i + 1] += 1;
      }
      snafuDigits[i] -= 5;
    }
  });

  if (leadingOne) {
    snafuDigits.push(1);
  }

  return snafuDigits.map(decimal => reverseSnafuMapping[decimal]).reverse().join("");
};

const func1 = (input: string[]) => {
  return decimalToSnafu(parseInput(input).reduce(sumNumbers));
};

console.log(1, func1(input));
