import { readInputs } from "../../util/input";
import "../../util/helpers";

//26602

const [input, testInput] = readInputs(__dirname);
const TEST = true;
const raw = TEST ? testInput : input;

const patterns = raw.reduce(
  (acc: string[][], row) => {
    if (row[0] === undefined) acc.push([]);
    else acc.last()!.push(row);
    return acc;
  },
  [[]]
);

//30472

export const func1 = () => {
  return patterns.sum((pattern, idx) => {
    const transposed = pattern.transposeStringArray();

    horizontalLoop: for (let i = 0; i < pattern.length - 1; i++) {
      const refSize = Math.min(i + 1, pattern.length - i - 1);
      // console.log(`i: ${i} | refSize: ${refSize}`);
      for (let j = 0; j < refSize; j++) {
        if (pattern[i + j + 1] !== pattern[i - j]) continue horizontalLoop;
      }

      console.log(idx + 1, "horizontal", i, (i + 1) * 100);
      return (i + 1) * 100;
    }

    verticalLoop: for (let i = 0; i < transposed.length - 1; i++) {
      const refSize = Math.min(i + 1, transposed.length - i - 1);
      // console.log(`i: ${i} | refSize: ${refSize}`);
      for (let j = 0; j < refSize; j++) {
        if (transposed[i + j + 1] !== transposed[i - j]) continue verticalLoop;
      }

      console.log(idx + 1, "vertical", i, i + 1);
      return i + 1;
    }

    console.log("panic, no match");

    return 0;
  });
};

export const func2 = () => {
  return patterns.sum((pattern, idx) => {
    const transposed = pattern.transposeStringArray();

    let repaired = false;

    horizontalLoop: for (let i = 0; i < pattern.length - 1; i++) {
      const refSize = Math.min(i + 1, pattern.length - i - 1);
      // console.log(`i: ${i} | refSize: ${refSize}`);
      for (let j = 0; j < refSize; j++) {
        if (pattern[i + j + 1] !== pattern[i - j]) {
          if (repaired) {
            repaired = false;
            continue horizontalLoop;
          }
          const toRepair = pattern[i + j + 1].split("").filter((c, cIdx) => c !== pattern[i - j][cIdx]).length;

          if (toRepair > 1) continue horizontalLoop;
          repaired = true;
        }
      }

      if (repaired) {
        console.log(idx + 1, "horizontal", i, (i + 1) * 100);
        return (i + 1) * 100;
      }
    }

    verticalLoop: for (let i = 0; i < transposed.length - 1; i++) {
      const refSize = Math.min(i + 1, transposed.length - i - 1);
      // console.log(`i: ${i} | refSize: ${refSize}`);
      for (let j = 0; j < refSize; j++) {
        if (transposed[i + j + 1] !== transposed[i - j]) {
          if (repaired) {
            repaired = false;
            continue verticalLoop;
          }
          const toRepair = transposed[i + j + 1].split("").filter((c, cIdx) => c !== transposed[i - j][cIdx]).length;

          if (toRepair > 1) continue verticalLoop;
          repaired = true;
        }
      }

      if (repaired) {
        console.log(idx + 1, "vertical", i, i + 1);
        return i + 1;
      }
    }

    console.log("panic, no match");

    return 0;
  });
};
