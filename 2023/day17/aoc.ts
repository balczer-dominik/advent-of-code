import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Direction2DOrthogonal, directions2DOrthogonal, move2D, opposite2D } from "../../util/2d";
import _ from "lodash";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;
const mapSize = raw.length;

type NextStep = [number, number, number, Direction2DOrthogonal, number];

const getNextSteps = (node: string, minStep: number, maxStep: number): NextStep[] => {
  const [x, y, directionFrom, steps] = node.split("-");
  const jumpFrom = [parseInt(x), parseInt(y)] as Tuple;

  return directions2DOrthogonal.flatMap((direction) => {
    if (direction === opposite2D[directionFrom as Direction2DOrthogonal]) return [];

    const incMin = direction === directionFrom ? 1 : minStep;
    const incMax = direction === directionFrom ? maxStep - parseInt(steps) : maxStep;

    return _.range(incMin, incMax + 1).flatMap((inc) => {
      const neighborCoords = move2D(jumpFrom, direction, inc);
      if (neighborCoords.some((coord) => coord < 0 || coord >= mapSize)) return [];
      const jumpCost = _.range(1, inc + 1).sum((jump) => {
        const [jX, jY] = move2D(jumpFrom, direction, jump);
        return parseInt(raw[jY][jX]);
      });
      return [[...neighborCoords, jumpCost, direction, direction === directionFrom ? parseInt(steps) + inc : inc]] as NextStep[];
    });
  });
};

const dijkstra = (minStep: number, maxStep: number) => {
  const nodes = _.range(0, mapSize).flatMap((y) =>
    _.range(0, mapSize).flatMap((x) =>
      directions2DOrthogonal.flatMap((direction) => _.range(minStep, maxStep + 1).map((steps) => `${x}-${y}-${direction}-${steps}`))
    )
  );

  let queue: string[] = ["0-0-RIGHT-0", ...nodes];
  const closed = new Set();

  const distances = new Map<string, number>();
  nodes.forEach((node) => distances.set(node, Number.MAX_SAFE_INTEGER));
  distances.set(`0-0-RIGHT-0`, 0);

  while (queue.length) {
    const curr = queue.shift()!;
    const currDistance = distances.get(curr)!;
    if (curr.startsWith(`${mapSize - 1}-${mapSize - 1}`)) return currDistance;
    if (currDistance === Number.MAX_SAFE_INTEGER) throw new Error("Couldn't reach destination");

    closed.add(curr);

    getNextSteps(curr, minStep, maxStep).forEach(([nX, nY, jumpDistance, direction, steps]) => {
      const node = `${nX}-${nY}-${direction}-${steps}`;

      if (closed.has(node)) return;

      const distance = currDistance + jumpDistance;

      if (distance < distances.get(node)!) {
        const oldIdx = queue.findIndex((s) => s === node);
        queue.splice(oldIdx, 1);

        const newIdx = queue.findIndex((s) => distances.get(s)! >= distance);
        queue.splice(newIdx, 0, node);

        distances.set(node, distance);
      }
    });
  }

  throw new Error("Couldn't reach destination");
};

export const func1 = () => dijkstra(1, 3);
export const func2 = () => dijkstra(4, 10);
