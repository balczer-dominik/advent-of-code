import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Direction2DOrthogonal, directions2DOrthogonal, move2D, opposite2D } from "../../util/2d";
import _ from "lodash";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const nodes = raw.flatMap((row, y) =>
  row
    .numberSequence("")
    .flatMap((c, x) => directions2DOrthogonal.flatMap((direction) => _.range(1, 4).map((steps) => `${x}-${y}-${direction}-${steps}`)))
);
const nodes2 = raw.flatMap((row, y) =>
  row
    .numberSequence("")
    .flatMap((c, x) => directions2DOrthogonal.flatMap((direction) => _.range(4, 11).map((steps) => `${x}-${y}-${direction}-${steps}`)))
);

const getNextSteps = (node: string): [number, number, number, Direction2DOrthogonal, number][] => {
  const [x, y, direction, steps] = node.split("-");

  return directions2DOrthogonal.flatMap((d) => {
    if (d === opposite2D[direction as Direction2DOrthogonal]) return [];
    if (d === direction && steps === "3") return [];

    const [nX, nY] = move2D([parseInt(x), parseInt(y)], d);
    if ([nX, nY].some((c) => c < 0 || c >= raw.length)) return [];

    return [[nX, nY, parseInt(raw[nY][nX]), d, d === direction ? parseInt(steps) + 1 : 1]];
  });
};

const getNextSteps2 = (node: string): [number, number, number, Direction2DOrthogonal, number][] => {
  const [x, y, direction, steps] = node.split("-");
  const jumpFrom = [parseInt(x), parseInt(y)] as Tuple;

  return directions2DOrthogonal.flatMap((d) => {
    if (d === opposite2D[direction as Direction2DOrthogonal]) return [];

    const incMin = d === direction ? 1 : 4;
    const incMax = d === direction ? 10 - parseInt(steps) : 10;

    let neighbors = [] as ReturnType<typeof getNextSteps2>;

    for (let inc = incMin; inc <= incMax; inc++) {
      const [nX, nY] = move2D(jumpFrom, d, inc);
      if (nX < 0 || nX >= raw[0].length || nY < 0 || nY >= raw.length) continue;
      let jumpCost = 0;
      for (let jumps = 1; jumps <= inc; jumps++) {
        const [jX, jY] = move2D(jumpFrom, d, jumps);
        jumpCost += parseInt(raw[jY][jX]);
      }
      neighbors.push([nX, nY, jumpCost, d, d === direction ? parseInt(steps) + inc : inc]);
    }

    return neighbors;
  });
};

const dijkstra = (nodes: string[], neighborExtractor: typeof getNextSteps) => {
  const distances = new Map<string, number>();
  const prev = new Map<string, string>();
  const closed = new Set();
  let queue: string[] = [];

  nodes.forEach((node) => {
    distances.set(node, Number.MAX_SAFE_INTEGER);
    queue.push(node);
  });

  queue.unshift("0-0-RIGHT-0");
  distances.set(`0-0-RIGHT-0`, 0);

  let i = 0;
  while (queue.length) {
    const curr = queue.shift()!;
    closed.add(curr);

    const currDistance = distances.get(curr)!;
    if (curr.startsWith(`${raw[0].length - 1}-${raw.length - 1}`)) return distances;
    if (currDistance === Number.MAX_SAFE_INTEGER) return distances;

    neighborExtractor(curr).forEach(([nX, nY, jumpCost, direction, steps]) => {
      const stringified = `${nX}-${nY}-${direction}-${steps}`;

      if (closed.has(stringified)) return;

      const alt = currDistance + jumpCost;

      if (alt < distances.get(stringified)!) {
        const oldIdx = queue.findIndex((s) => s === stringified);
        queue.splice(oldIdx, 1);

        const newIdx = queue.findIndex((s) => distances.get(s)! >= alt);

        queue.splice(newIdx, 0, stringified);

        distances.set(stringified, alt);
        prev.set(stringified, curr);
      }
    });
  }

  return distances;
};

export const func1 = () => {
  return [...dijkstra(nodes, getNextSteps).entries()]
    .filter(([k, v]) => k.startsWith(`${raw[0].length - 1}-${raw.length - 1}`))
    .min(([k, v]) => v);
};

export const func2 = () => {
  return [...dijkstra(nodes2, getNextSteps2).entries()]
    .filter(([k, v]) => k.startsWith(`${raw[0].length - 1}-${raw.length - 1}`))
    .min(([k, v]) => v);
};
