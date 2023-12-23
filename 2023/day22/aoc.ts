import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";
import { Triplet, X, Y, Z } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Brick = Triplet[];
type SupportGraph = Map<string, string[]>;

const bricks = raw
  .map((row) => {
    const [sx, sy, sz, ex, ey, ez] = row.split("~").flatMap((coord) => coord.numberSequence(","));
    return _.range(sx, ex + 1).flatMap((x) => _.range(sy, ey + 1).flatMap((y) => _.range(sz, ez + 1).map((z) => [x, y, z])));
  })
  .sort((a, b) => a.max((c) => c[Z]) - b.max((c) => c[Z]));

const dropBricks = () =>
  bricks.reduce(
    ([settledBricks, supportGraph]: [Brick[], SupportGraph], fallingBrick) => {
      const supportingBrickCandidates = settledBricks.filter((settledBrick) =>
        settledBrick.some(([x, y]) => fallingBrick.some((c) => c[X] === x && c[Y] === y))
      );
      const highestZ = supportingBrickCandidates.max((brick) => brick.max((t) => t[Z])) ?? 0;
      const supportingBricks = supportingBrickCandidates.filter((brick) => brick.max((t) => t[Z]) === highestZ);

      const zBase = fallingBrick.min((c) => c[Z]);
      const settledBrick = fallingBrick.map(([x, y, z]) => [x, y, highestZ + (z - zBase) + 1]);

      supportingBricks.forEach((supportingBrick) => {
        const stringified = JSON.stringify(supportingBrick);
        const entry = supportGraph.get(stringified) ?? [];
        supportGraph.set(stringified, [...entry, JSON.stringify(settledBrick)]);
      });

      return [[...settledBricks, settledBrick], supportGraph] as [Brick[], SupportGraph];
    },
    [[], new Map()]
  );

const getNonCriticalBricks = (settledBricks: Brick[], supportGraph: SupportGraph) =>
  settledBricks.filter((brick) => {
    const supporting = supportGraph.get(JSON.stringify(brick));
    return !supporting || supporting.every((brick) => [...supportGraph.values()].filter((s) => s.includes(brick)).length >= 2);
  });

export const func1 = () => getNonCriticalBricks(...dropBricks()).length;

export const func2 = () => {
  const [settledBricks, supportGraph] = dropBricks();
  const nonCriticalBricks = getNonCriticalBricks(settledBricks, supportGraph);
  const reverseSupportGraph: SupportGraph = new Map();

  settledBricks.forEach((brick) => {
    if (brick.some((c) => c[Z] === 1)) return;
    const stringified = JSON.stringify(brick);
    const supportedBy = [...supportGraph.entries()].filter((brick) => brick[1].includes(stringified)).map((brick) => brick[0]);
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
          copy[copyKey] = copy[copyKey].filter((brick) => brick !== toRemove);
          if (!copy[copyKey].length) {
            queue.push(copyKey);
            delete copy[copyKey];
            removed++;
          }
        }
      }

      return removed;
    });
};
