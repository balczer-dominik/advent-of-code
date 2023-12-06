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

export const func1 = () => times.map((time, i) => getWinningPossibilities(time, distances[i])).reduce(multiplyNumbers);
export const func2 = () => getWinningPossibilities(parseInt(times.join("")), parseInt(distances.join("")));

const getWinningPossibilities = (time: number, distance: number) => {
  return (
    _.rangeRight(0, time).find((charge) => charge * (time - charge) > distance)! -
    _.range(0, time).find((charge) => charge * (time - charge) > distance)! +
    1
  );
};
