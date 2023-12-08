import { readInputs } from "../../util/input";
import "../../util/helpers";

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
