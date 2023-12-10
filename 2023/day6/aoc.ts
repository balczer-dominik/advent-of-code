import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const [times, distances] = raw.map((row) => row.numberSequence());

export const func1 = () => times.product((time, i) => getWinningPossibilities(time, distances[i]));
export const func2 = () => getWinningPossibilities(times.join("").toNumber(), distances.join("").toNumber());

const getWinningPossibilities = (time: number, distance: number) =>
  _.rangeRight(0, time).find((charge) => charge * (time - charge) > distance)! -
  _.range(0, time).find((charge) => charge * (time - charge) > distance)! +
  1;
