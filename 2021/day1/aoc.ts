import { readInputs } from "../../util/input";
import "../../util/helpers";
import { simpleParseInt } from "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;
const measurements = raw.map(simpleParseInt);

export const func1 = () => measurements.slice(1).filter((m, i) => m > measurements[i]).length;
export const func2 = () =>
  measurements.slice(0, -3).filter((_, i) => measurements.slice(i, i + 3).sum() < measurements.slice(i + 1, i + 4).sum()).length;
