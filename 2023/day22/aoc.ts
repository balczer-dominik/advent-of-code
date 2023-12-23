import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";
import { Triplet, X, Y, Z } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const bricks = raw
  .map((row) => {
    const [start, end] = row.split("~");
    const [sx, sy, sz] = start.numberSequence(",");
    const [ex, ey, ez] = end.numberSequence(",");

    return _.range(sx, ex + 1).flatMap((x) => _.range(sy, ey + 1).flatMap((y) => _.range(sz, ez + 1).map((z) => [x, y, z])));
  })
  .sort((a, b) => a.max((c) => c[Z]) - b.max((c) => c[Z]));

const dropBricks = () => {
  const settledBricks: Triplet[][] = [];
  const supportGraph = new Map<string, string[]>();

  bricks.forEach((fallingBrick) => {
    const supportingBrickCandidates = settledBricks.filter((settledBrick) => {
      return settledBrick.some(([x, y]) => fallingBrick.some((c) => c[X] === x && c[Y] === y));
    });
    const highestZ = supportingBrickCandidates.max((brick) => brick.max((t) => t[Z])) ?? 0;
    const supportingBricks = supportingBrickCandidates.filter((brick) => brick.max((t) => t[Z]) === highestZ);

    const zBase = fallingBrick.min((c) => c[Z]);
    const settledCoords = fallingBrick.map(([x, y, z]) => [x, y, highestZ + (z - zBase) + 1]) as Triplet[];

    supportingBricks.forEach((supportingBrick) => {
      const stringified = JSON.stringify(supportingBrick);
      const entry = supportGraph.get(stringified) ?? [];
      supportGraph.set(stringified, [...entry, JSON.stringify(settledCoords)]);
    });

    settledBricks.push(settledCoords);
  });

  return [settledBricks, supportGraph] as const;
};

const getNonCriticalBricks = (settledBricks: Triplet[][], supportGraph: Map<string, string[]>) => {
  return settledBricks.filter((brick) => {
    const supporting = supportGraph.get(JSON.stringify(brick));
    if (!supporting) return true;

    return supporting.every((brick) => {
      const supportedBy = [...supportGraph.values()].filter((s) => s.includes(brick)).length;
      return supportedBy >= 2;
    });
  });
};

export const func1 = () => {
  const [settledBricks, supportGraph] = dropBricks();

  return getNonCriticalBricks(settledBricks, supportGraph).length;
};

export const func2 = () => {
  const [settledBricks, supportGraph] = dropBricks();
  const nonCriticalBricks = getNonCriticalBricks(settledBricks, supportGraph);
  const reverseSupportGraph = new Map<string, string[]>(); //shows which blocks support each block

  settledBricks.forEach((brick) => {
    if (brick.some((c) => c[Z] === 1)) return;
    const stringified = JSON.stringify(brick);
    const supportedBy = [...supportGraph.entries()].filter((b) => b[1].includes(stringified)).map((b) => b[0]);
    reverseSupportGraph.set(stringified, supportedBy);
  });

  return settledBricks
    .filter((brick) => !nonCriticalBricks.includes(brick))
    .sum((brick) => {
      let copy = Object.fromEntries(reverseSupportGraph.entries());
      let removed = 0;
      const queue = [JSON.stringify(brick)];

      while (queue.length) {
        const toRemove = queue.shift()!;
        for (const copyKey in copy) {
          const newSupporting = copy[copyKey].filter((b) => b !== toRemove);
          copy[copyKey] = newSupporting;
          if (!newSupporting.length) {
            queue.push(copyKey);
            delete copy[copyKey];
            removed++;
          }
        }
      }

      console.log(brick, removed);

      return removed;
    });
};
