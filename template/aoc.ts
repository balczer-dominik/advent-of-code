import { readInputs } from "../util/input";

const [input, testInput] = readInputs(__dirname);
const TEST = true;

const parseInput = () => {
  const raw = TEST ? testInput : input;

  return raw;
};

const func1 = () => {
  const parsed = parseInput();

  return parsed;
};

const func2 = () => {
  const parsed = parseInput();

  return parsed;
};

console.log(1, func1());
console.log(2, func2());
