import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const mapped = raw.map((row) => {
  const [groups, groupSizes] = row.split(" ");
  return {
    groups: groups,
    groupSizes: groupSizes.numberSequence(","),
  };
});

const mapped2 = raw.map((row) => {
  const [groups, groupSizes] = row.split(" ");
  return {
    groups: _.range(0, 5)
      .map(() => groups)
      .join("?"),
    groupSizes: _.range(0, 5).flatMap(() => groupSizes.numberSequence(",")),
  };
});

const getPermutation = (row: string, groups: number[]) => {
  let queue = { "0-0": 1 } as { [key: string]: number };
  for (let c of row) {
    let next = {} as { [key: string]: number };
    Object.entries(queue).forEach(([key, valid]) => {
      const [group, count] = key.numberSequence("-");
      if (c === ".") {
        if (count === 0 || count === groups[group]) {
          next[`${group + (count === 0 ? 0 : 1)}-${0}`] = (next[`${group + (count === 0 ? 0 : 1)}-${0}`] ?? 0) + valid;
        }
      } else if (c === "#") {
        if (count < groups[group]) {
          next[`${group}-${count + 1}`] = (next[`${group}-${count + 1}`] ?? 0) + valid;
        }
      } else if (c === "?") {
        if (count === 0 || count === groups[group]) {
          next[`${group + (count === 0 ? 0 : 1)}-${0}`] = (next[`${group + (count === 0 ? 0 : 1)}-${0}`] ?? 0) + valid;
        }
        if (count < groups[group]) {
          next[`${group}-${count + 1}`] = (next[`${group}-${count + 1}`] ?? 0) + valid;
        }
      }
    });
    queue = next;
  }

  const filtered = Object.entries(queue).filter(([key]) => {
    const [group, count] = key.numberSequence("-");
    if (group < groups.length - 1) return false;
    if (count < groups.last()! && group === groups.length - 1) return false;
    return true;
  });
  return filtered.sum(([_, value]) => value);
};

export const func1 = () => {
  return mapped.sum(({ groups, groupSizes }) => getPermutation(groups, groupSizes));
};

export const func2 = () => {
  return mapped2.sum(({ groups, groupSizes }, i) => {
    const d = getPermutation(groups, groupSizes);
    console.log(i, d);
    return d;
  });
};
