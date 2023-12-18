import { readInputs } from "../../util/input";
import "../../util/helpers";
import {
  DOWN,
  Direction2DOrthogonal,
  LEFT,
  Map2D,
  RIGHT,
  UP,
  directions2DOrthogonal,
  getField2D,
  getNeighbor,
  move2D,
  opposite2D,
  shoelace,
} from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Pipe = "|" | "-" | "L" | "J" | "7" | "F" | "S";
const map: Map2D<Pipe> = new Map();
let start: Tuple;
raw.forEach((row, y) => {
  const yMap = map.set(y, new Map()).get(y)!;
  row.split("").forEach((char, x) => {
    yMap.set(x, char as Pipe);
    if (char === "S") start = [x, y];
  });
});

const validMoves: Record<Pipe, Array<Direction2DOrthogonal>> = {
  "|": [UP, DOWN],
  "-": [LEFT, RIGHT],
  L: [UP, RIGHT],
  J: [UP, LEFT],
  "7": [DOWN, LEFT],
  F: [DOWN, RIGHT],
  S: [UP, DOWN, LEFT, RIGHT],
};

const getLoop = () => {
  let loop = [start];
  let prevDir = directions2DOrthogonal.filter((dir) => validMoves[getNeighbor(map, start, dir)!].find((d) => opposite2D[d] === dir))[0];
  for (let field = move2D(start, prevDir); field[X] !== start![X] || field[Y] !== start![Y]; field = move2D(field, prevDir)) {
    loop.push(field);
    prevDir = validMoves[getField2D(map, field)!]!.find((dir) => dir !== opposite2D[prevDir])!;
  }
  return loop;
};

export const func1 = () => getLoop().length / 2;

export const func2 = () => {
  const loop = getLoop();
  return shoelace(loop) - loop.length / 2 + 1;
};
