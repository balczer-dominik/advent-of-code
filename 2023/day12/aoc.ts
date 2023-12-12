import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const getPermutation = (row: string, groupLengths: number[]) => {
  let queue = { "0-0": 1 } as { [key: string]: number };
  for (let symbol of row) {
    let next = {} as typeof queue;
    Object.entries(queue).forEach(([key, valid]) => {
      const [group, count] = key.numberSequence("-");
      if ((symbol === "." || symbol === "?") && (count === 0 || count === groupLengths[group]))
        next[`${group + (count === 0 ? 0 : 1)}-${0}`] = (next[`${group + (count === 0 ? 0 : 1)}-${0}`] ?? 0) + valid;
      if ((symbol === "?" || symbol === "#") && count < groupLengths[group])
        next[`${group}-${count + 1}`] = (next[`${group}-${count + 1}`] ?? 0) + valid;
    });
    queue = next;
  }

  return Object.entries(queue).sum(([key, value]) => {
    const [group, count] = key.numberSequence("-");
    return group < groupLengths.length - 1 || (count < groupLengths.last()! && group === groupLengths.length - 1) ? 0 : value;
  });
};

export const func1 = () =>
  raw.sum((row) => {
    const [groups, groupSizes] = row.split(" ");
    return getPermutation(groups, groupSizes.numberSequence(","));
  });

export const func2 = () =>
  raw.sum((row) => {
    const [groups, groupSizes] = row.split(" ");
    return getPermutation(
      _.range(0, 5)
        .map(() => groups)
        .join("?"),
      _.range(0, 5).flatMap(() => groupSizes.numberSequence(","))
    );
  });
