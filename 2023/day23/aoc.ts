import { readInputs } from "../../util/input";
import "../../util/helpers";
import { DOWN, Direction2DOrthogonal, RIGHT, directions2DOrthogonal, move2D } from "../../util/2d";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;
const neighborMap = new Map<string, string[]>();
const neighborMapButILearnedToClimb = new Map<string, string[]>();

type Slope = ">" | "v";
const slopToDir: Record<Slope, Direction2DOrthogonal> = {
  ">": RIGHT,
  v: DOWN,
};

raw.forEach((row, y) =>
  row.split("").forEach((c, x) => {
    if (c === "#") return;
    const neighbors = directions2DOrthogonal
      .filter((dir) => c === "." || dir === slopToDir[c as Slope])
      .map((dir) => move2D([x, y], dir))
      .filter(([x, y]) => [".", "v", ">"].includes(raw.at(y)?.at(x) ?? ""))
      .map(([x, y]) => `${x}=${y}`);
    neighborMap.set(`${x}=${y}`, neighbors);
  })
);

raw.forEach((row, y) =>
  row.split("").forEach((c, x) => {
    if (c === "#") return;
    const neighbors = directions2DOrthogonal
      .map((dir) => move2D([x, y], dir))
      .filter(([x, y]) => [".", "v", ">"].includes(raw.at(y)?.at(x) ?? ""))
      .map(([x, y]) => `${x}=${y}`);
    neighborMapButILearnedToClimb.set(`${x}=${y}`, neighbors);
  })
);

const getMostScenicTrail = (neighborMap: Map<string, string[]>) => {
  const junctions = raw.flatMap((row, y) =>
    row.split("").flatMap((c, x) => (c === "#" || (neighborMap.get(`${x}=${y}`)?.length ?? 0) <= 2 ? [] : [`${x}=${y}`]))
  );

  junctions.push(`${1}=${0}`, `${raw[0].length - 2}=${raw.length - 1}`);

  const junctionNeighbors = new Map<string, { [key: string]: number }>();

  junctions.forEach((junction) => {
    const queue: string[][] = [[junction]];
    const neighbors: { [key: string]: number } = {};

    while (queue.length) {
      const visited = queue.shift()!;

      neighborMap
        .get(visited.last()!)!
        .filter((node) => !visited.includes(node))
        .forEach((newHead) => {
          if (junctions.includes(newHead)) {
            neighbors[newHead] = visited.length;
            return;
          }
          queue.push([...visited, newHead]);
        });
    }

    junctionNeighbors.set(junction, neighbors);
  });

  const queue: string[][] = [[`${1}=${0}`]];

  let longest = 0;

  while (queue.length) {
    const visited = queue.pop()!;

    if (visited.last()! === `${raw[0].length - 2}=${raw.length - 1}`) {
      const distance = _.range(0, visited.length - 1).sum((idx) => junctionNeighbors.get(visited[idx])![visited[idx + 1]]);
      if (longest < distance) longest = distance;
    }

    Object.keys(junctionNeighbors.get(visited.last()!)!)
      .filter((junction) => !visited.includes(junction))
      .forEach((nextJunction) => queue.push([...visited, nextJunction]));
  }

  return longest;
};

export const func1 = () => getMostScenicTrail(neighborMap);
export const func2 = () => getMostScenicTrail(neighborMapButILearnedToClimb);
