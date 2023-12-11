import _ from "lodash";
import "../../util/helpers";
import { readInputs } from "../../util/input";

const [input, testInput] = readInputs(__dirname);

const getNewIndex = (oldIndex: number, moveBy: number, length: number) => {
  const index = (oldIndex + moveBy) % length;
  return index >= 0 ? index : length + index;
};

const func = (input: string[], mixingCycles: number, decryptionKey: number) => {
  const numbers = input.map((moveBy, order) => ({ moveBy: parseInt(moveBy), order }));

  const numbersCopy = _.cloneDeep(numbers);
  for (let index = 0; index < mixingCycles; index++) {
    for (const { order, moveBy } of numbers) {
      const oldIdx = numbersCopy.findIndex((i) => i.order === order)!;
      const item = numbersCopy.splice(oldIdx, 1)[0];
      const newIdx = getNewIndex(oldIdx, moveBy * decryptionKey, numbers.length - 1);
      numbersCopy.splice(newIdx, 0, item);
    }
  }

  const zeroIndex = numbersCopy.findIndex((t) => t.moveBy === 0) - 1;

  return [1000, 2000, 3000].sum((offset) => numbersCopy[getNewIndex(zeroIndex, offset, numbersCopy.length - 1)].moveBy * decryptionKey);
};

console.log(1, func(input, 1, 1));
console.log(2, func(input, 10, 811589153));
