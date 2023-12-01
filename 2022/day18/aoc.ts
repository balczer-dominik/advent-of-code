import { simpleParseInt, sortAsc, sortDesc } from "../../util/helpers";
import { readInputs } from "../../util/input";
import { Triplet } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);

const sides = ["N", "E", "W", "S", "U", "D"] as const;
type Side = (typeof sides)[number];

const X = 0;
const Y = 1;
const Z = 2;
const OPPOSITE = 3;

const offsets: Record<Side, [number, number, number, Side]> = {
  D: [0, 0, 1, "U"],
  U: [0, 0, -1, "D"],
  N: [0, -1, 0, "S"],
  S: [0, 1, 0, "N"],
  W: [-1, 0, 0, "E"],
  E: [1, 0, 0, "W"],
};

type GridMap = Map<number, { x: number; sidesCovered: Side[] }[]>;
type CubeMap = Map<number, GridMap>;

const func1 = (input: string[]) => {
  const triplets = input.map(
    (row) => [...row.split(",").map(simpleParseInt)] as Triplet
  );

  const map: CubeMap = constructMap(triplets);

  return countFreeSides(map);
};

const countFreeSides = (map: CubeMap) => {
  let sidesFree = 0;

  [...map].forEach(([z, Ys]) => {
    [...Ys].forEach(([y, Xs]) => {
      Xs.forEach((x) => {
        sides.forEach((side) => {
          const offset = offsets[side];
          if (!x.sidesCovered.includes(side)) {
            const blockingCube = map
              .get(z + offset[Z])
              ?.get(y + offset[Y])
              ?.find((f) => f.x === x.x + offset[X]);

            if (blockingCube) {
              x.sidesCovered.push(side);
              blockingCube.sidesCovered.push(offset[OPPOSITE]);
            } else {
              sidesFree++;
            }
          }
        });
      });
    });
  });

  return sidesFree;
};

const constructMap = (triplets: Triplet[]): CubeMap => {
  const map: CubeMap = new Map();
  triplets.forEach((cube) => {
    const z = map.get(cube[Z]) ?? (new Map() as GridMap);
    const y = z.get(cube[Y]) ?? [];
    z.set(cube[Y], [...y, { x: cube[X], sidesCovered: [] }]);
    map.set(cube[Z], z);
  });

  return map;
};

const func2 = (input: string[]) => {
  const triplets = input.map(
    (row) => [...row.split(",").map(simpleParseInt)] as Triplet
  );

  const map: CubeMap = constructMap(triplets);

  const xBound = triplets.map((t) => t[X]).sort(sortDesc)[0] + 2;
  const yBound = triplets.map((t) => t[Y]).sort(sortDesc)[0] + 2;
  const zBound = triplets.map((t) => t[Z]).sort(sortDesc)[0] + 2;

  const xLowerBound = triplets.map((t) => t[X]).sort(sortAsc)[0] - 2;
  const yLowerBound = triplets.map((t) => t[Y]).sort(sortAsc)[0] - 2;
  const zLowerBound = triplets.map((t) => t[Z]).sort(sortAsc)[0] - 2;

  let visibleSides = 0;
  let current = [xLowerBound + 1, yLowerBound + 1, zLowerBound + 1] as Triplet;
  const queue: Triplet[] = [current];
  const visited: Triplet[] = [current];
  while (queue.length > 0) {
    current = queue.shift()!;
    Object.values(offsets).forEach((v) => {
      const x = current[X] + v[X];
      const y = current[Y] + v[Y];
      const z = current[Z] + v[Z];

      if (
        !x.isBetween(xLowerBound, xBound) ||
        !y.isBetween(yLowerBound, yBound) ||
        !z.isBetween(zLowerBound, zBound)
      ) {
        return;
      }

      if (visited.some((v) => v[X] === x && v[Y] === y && v[Z] === z)) {
        return;
      }

      if (
        map
          .get(z)
          ?.get(y)
          ?.some((space) => space.x === x)
      ) {
        visibleSides++;
      } else {
        queue.push([x, y, z]);
        visited.push([x, y, z]);
      }
    });
  }

  return visibleSides;
};

console.log(1, func1(input));
console.log(2, func2(input));
