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

const getNextMirror = ([fromX, fromY]: Tuple, direction: Direction2DOrthogonal): Tuple => {
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

const getNumberOfEnergized = (entryPoint: Tuple, entryDir: Direction2DOrthogonal) => {
  const beams = new Set<string>();
  const entryMirrorType = mirrors.find(({ x, y }) => x === entryPoint[X] && y === entryPoint[Y])?.type;
  const firstDir = entryMirrorType ? nextDir[entryMirrorType][entryDir] : [entryDir];
  let beamQueue = firstDir.map((dir) => ({ start: entryPoint, dir }));

  while (beamQueue.length) {
    beamQueue = beamQueue.flatMap(({ start, dir }) => {
      const mirrorPos = getNextMirror(start, dir);
      if (mirrorPos[X] === start[X] && mirrorPos[Y] === start[Y]) return [];
      const stringified = `${start[X]}-${start[Y]}=${mirrorPos[X]}-${mirrorPos[Y]}`;
      if (beams.has(stringified)) return [];
      beams.add(stringified);
      const mirrorHit = mirrors.find(({ x, y }) => x === mirrorPos[X] && y === mirrorPos[Y])?.type;
      if (!mirrorHit) return [];
      return nextDir[mirrorHit][dir].map((newDir) => ({
        start: mirrorPos,
        dir: newDir,
      }));
    });
  }

  const lit = new Set();

  for (let beam of beams) {
    const [[fromX, fromY], [toX, toY]] = beam.split("=").map((coord) => coord.numberSequence("-"));
    for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++)
      for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) lit.add(`${x}-${y}`);
  }

  return lit.size;
};

export const func1 = () => getNumberOfEnergized([0, 0], RIGHT);

export const func2 = () =>
  [
    ...(_.range(0, raw[0].length).flatMap((x) => [
      [x, 0, DOWN],
      [x, raw.length - 1, UP],
    ]) as [number, number, Direction2DOrthogonal][]),
    ...(_.range(0, raw.length).flatMap((y) => [
      [0, y, RIGHT],
      [raw[0].length - 1, y, LEFT],
    ]) as [number, number, Direction2DOrthogonal][]),
  ].max(([x, y, d]) => getNumberOfEnergized([x, y], d));
