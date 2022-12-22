import { readInputs } from "../util/input";

const [input, testInput] = readInputs(__dirname);

const parseInput = (input: string[]) => {};

const func1 = (input: string[]) => {
  const parsed = parseInput(input);

  return parsed;
};

const func2 = (input: string[]) => {
  const parsed = parseInput(input);

  return parsed;
};

console.log(1, func1(input));
console.log(2, func2(input));
