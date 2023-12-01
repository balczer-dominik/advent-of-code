import { readInputs } from "../../util/input";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const parseInput = () => {
  const raw = TEST ? testInput : input;

  return raw;
};
const parsed = parseInput();

export const func1 = () => {
  return undefined;
};

export const func2 = () => {
  return undefined;
};
