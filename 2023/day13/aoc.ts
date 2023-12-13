import { readInputs } from "../../util/input";
import "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const patterns: string[][] = [[]];
raw.forEach((row) => {
  if (!row[0]) patterns.push([]);
  else patterns.last()!.push(row);
});

const getReflectionDistance = (pattern: string[], multiplier: number = 1, canRepair: boolean = false) => {
  loop: for (let reflectionLine = 0; reflectionLine < pattern.length - 1; reflectionLine++) {
    const refSize = Math.min(reflectionLine + 1, pattern.length - reflectionLine - 1);
    let repaired = !canRepair;
    for (let distanceFromReflection = 0; distanceFromReflection < refSize; distanceFromReflection++) {
      if (pattern[reflectionLine + distanceFromReflection + 1] !== pattern[reflectionLine - distanceFromReflection]) {
        if (repaired) continue loop;
        const toRepair = pattern[reflectionLine + distanceFromReflection + 1]
          .split("")
          .filter((c, cIdx) => c !== pattern[reflectionLine - distanceFromReflection][cIdx]).length;
        if (toRepair > 1) continue loop;
        repaired = true;
      }
    }

    if (repaired) return (reflectionLine + 1) * multiplier;
  }
};

export const func1 = () =>
  patterns.sum((pattern) => getReflectionDistance(pattern, 100) || getReflectionDistance(pattern.transposeStringArray()) || 0);

export const func2 = () =>
  patterns.sum(
    (pattern) => getReflectionDistance(pattern, 100, true) || getReflectionDistance(pattern.transposeStringArray(), 1, true) || 0
  );
