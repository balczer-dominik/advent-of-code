import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const emptyX = _.range(0, raw[0].length).filter((x) => raw.every((row) => row[x] === "."));
const emptyY = raw.flatMap((row, y) => (row.split("").every((c) => c === ".") ? [y] : []));
const galaxies = raw.flatMap((row, y) => row.split("").flatMap((c, x) => (c === "." ? [] : [[x, y]])));

export const getDistanceSum = (expansion: number) =>
  galaxies.sum(([x1, y1]) =>
    galaxies.sum(
      ([x2, y2]) =>
        Math.abs(x1 - x2) +
        emptyX.filter((x) => x.isBetween(x1, x2)).length * (expansion - 1) +
        Math.abs(y1 - y2) +
        emptyY.filter((y) => y.isBetween(y1, y2)).length * (expansion - 1)
    )
  ) / 2;

export const func1 = () => getDistanceSum(2);
export const func2 = () => getDistanceSum(1000000);
