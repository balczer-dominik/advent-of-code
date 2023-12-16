import { readInputs } from "../../util/input";
import "../../util/helpers";
import { DOWN, Direction2DOrthogonal, LEFT, RIGHT, UP } from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Mirror = "/" | "\\" | "-" | "|";

const mirrors = raw.flatMap((row, y) => row.split("").flatMap((c, x) => (c === "." ? [] : [{ x, y, type: c as Mirror }])));

const nextDir: Record<Mirror, Record<Direction2DOrthogonal, Array<Direction2DOrthogonal>>> = {
  "/": {
    RIGHT: [UP],
    LEFT: [DOWN],
    UP: [RIGHT],
    DOWN: [LEFT],
  },
  "\\": {
    RIGHT: [DOWN],
    LEFT: [UP],
    UP: [LEFT],
    DOWN: [RIGHT],
  },
  "-": {
    RIGHT: [RIGHT],
    LEFT: [LEFT],
    UP: [LEFT, RIGHT],
    DOWN: [LEFT, RIGHT],
  },
  "|": {
    RIGHT: [UP, DOWN],
    LEFT: [UP, DOWN],
    UP: [UP],
    DOWN: [DOWN],
  },
};

const getNextMirror = ([fromX, fromY]: Tuple, direction: Direction2DOrthogonal) => {
  let nextCoord;
  switch (direction) {
    case UP:
      nextCoord = mirrors.max(({ x, y }) => (x === fromX && y < fromY ? y : 0));
      break;
    case LEFT:
      nextCoord = mirrors.max(({ x, y }) => (y === fromY && x < fromX ? x : 0));
      break;
    case DOWN:
      nextCoord = mirrors.min(({ x, y }) => (x === fromX && y > fromY ? y : raw.length - 1));
      break;
    case RIGHT:
      nextCoord = mirrors.min(({ x, y }) => (y === fromY && x > fromX ? x : raw[0].length - 1));
      break;
  }

  return direction === UP || direction === DOWN ? [fromX, nextCoord] : [nextCoord, fromY];
};

//7156
//7386

const getLitSize = (entryPoint: Tuple, entryDir: Direction2DOrthogonal) => {
  const beamCache = new Set<string>();
  const entryMirrorType = mirrors.find(({ x, y }) => x === entryPoint[X] && y === entryPoint[Y])?.type;
  const firstDir = entryMirrorType ? nextDir[entryMirrorType][entryDir as Direction2DOrthogonal] : [entryDir];
  let beamQueue = firstDir.map((dir) => ({ start: entryPoint, dir }));
  const lit = new Set();

  while (beamQueue.length) {
    let newBeams = beamQueue.flatMap(({ start, dir }) => {
      const nextMirror = getNextMirror(start as Tuple, dir as Direction2DOrthogonal);
      const stringified = `${start[X]}->${start[Y]}=${nextMirror[X]}->${nextMirror[Y]}`;
      if (nextMirror[X] === start[X] && nextMirror[Y] === start[Y]) return [];
      if (beamCache.has(stringified)) return [];
      beamCache.add(stringified);
      const nextMirrorType = mirrors.find(({ x, y }) => x === nextMirror[X] && y === nextMirror[Y])?.type;
      if (!nextMirrorType) return [];
      return nextDir[nextMirrorType][dir as Direction2DOrthogonal].map((newDir) => ({
        start: nextMirror as Tuple,
        dir: newDir as Direction2DOrthogonal,
      }));
    });

    beamQueue = newBeams;
  }

  beamCache.forEach((beam) => {
    const [from, to] = beam.split("=");
    const [fromX, fromY] = from.numberSequence("->");
    const [toX, toY] = to.numberSequence("->");
    for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++)
      for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) lit.add(`${x}->${y}`);
  });
  let buffer = "";
  for (let y = 0; y < raw.length; y++) {
    for (let x = 0; x < raw[0].length; x++) buffer += lit.has(`${x}->${y}`) ? "#" : ".";
    buffer += "\n";
  }

  return lit.size;
};

export const func1 = () => {
  return getLitSize([0, 0], RIGHT);
};

//7323 too low
export const func2 = () => {
  return [
    _.range(0, raw[0].length).flatMap((x) => [
      [x, 0, DOWN],
      [x, raw.length - 1, UP],
    ]),
    _.range(0, raw.length).flatMap((y) => [
      [0, y, RIGHT],
      [raw[0].length - 1, y, LEFT],
    ]),
  ]
    .flat()
    .max(([x, y, d]) => getLitSize([x as number, y as number], d as Direction2DOrthogonal));
};
