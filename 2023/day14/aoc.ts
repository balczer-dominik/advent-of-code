import { readInputs } from "../../util/input";
import "../../util/helpers";
import _, { map } from "lodash";
import { X, Y } from "../../util/Tuple";
import { CircularIterator } from "../../util/CircularIterator";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const rounded = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => c === "O" ? [[x, y]] : []))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);
const block = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => c === "#" ? [[x, y]] : []))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);

export const func1 = () => {
  return _.range(0, raw[0].length).map(x => {
    const aggregated = rounded
      .filter(([rockX, rockY]) => rockX === x)
      .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockX === rockX && blockY < rockY).last()?.at(Y) ?? -1) + 1)
      .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

    return Object.entries(aggregated).sum(([foundation, quantity]) => _.rangeRight(raw[0].length - parseInt(foundation), raw[0].length - parseInt(foundation) - quantity).sum())
  }).sum()
};

export const func2 = () => {
  const cache:Map<number, Map<string, string>> = new Map()
  cache.set(0, new Map())
  cache.set(1, new Map())
  cache.set(2, new Map())
  cache.set(3, new Map())
  const iter = new CircularIterator(0,1,2,3)
  const first = iter.next()
  
  return _.range(0, raw[0].length).map(x => {
    const aggregated = rounded
      .filter(([rockX, rockY]) => rockX === x)
      .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockX === rockX && blockY < rockY).last()?.at(Y) ?? -1) + 1)
      .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

    return Object.entries(aggregated).sum(([foundation, quantity]) => _.rangeRight(raw[0].length - parseInt(foundation), raw[0].length - parseInt(foundation) - quantity).sum())
  }).sum()
};
