import { readInputs } from "../../util/input";
import { multiplyNumbers, simpleParseInt } from "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const [times, distances] = raw.map((row) =>
  row
    .split(" ")
    .filter((x) => x[0]?.isNumber())
    .map(simpleParseInt)
);

export const func1 = () => times.map((time, i) => getWinningPossibilities(time, distances[i])).product();
export const func2 = () => getWinningPossibilities(times.join("").toNumber(), distances.join("").toNumber());

const getWinningPossibilities = (time: number, distance: number) =>
  _.rangeRight(0, time).find((charge) => charge * (time - charge) > distance)! -
  _.range(0, time).find((charge) => charge * (time - charge) > distance)! +
  1;
