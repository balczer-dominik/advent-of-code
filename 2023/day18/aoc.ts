import { readInputs } from "../../util/input";
import "../../util/helpers";
import {
  DOWN,
  Direction2DOrthogonal,
  Direction2DShort,
  LEFT,
  RIGHT,
  UP,
  directions2DOrthogonal,
  move2D,
  parseShortDirection2D,
} from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

type Instruction = [Direction2DOrthogonal, number, string];

const instructions = raw.map((row) => {
  const [direction, count, color] = row.split(" ");
  return [parseShortDirection2D[direction as Direction2DShort], parseInt(count), color.slice(1, 8)] as Instruction;
});

// export const func1 = () => {
//   const painted = new Set<string>();

//   let head = [0, 0] as Tuple;

//   while (instructions.length) {
//     const [direction, stepCount, color] = instructions.shift()!;
//     for (let steps = 1; steps <= stepCount; steps++) {
//       head = move2D(head, direction);
//       painted.add(`${head[X]}=${head[Y]}`);
//     }
//   }

//   let queue = [[1, 1]] as Tuple[];

//   while (queue.length) {
//     head = queue.shift()!;

//     const neighbors = directions2DOrthogonal.flatMap((direction) => {
//       const neighbor = move2D(head, direction);
//       const stringified = `${neighbor[X]}=${neighbor[Y]}`;
//       if (painted.has(stringified)) return [];
//       painted.add(stringified);
//       return [neighbor];
//     });

//     queue.push(...neighbors);
//   }

//   return painted.size;
// };

const cutArea: Record<string, Record<string, number>> = {
  RIGHT: {
    UP: 1,
    DOWN: 3,
  },
  LEFT: {
    UP: 3,
    DOWN: 1,
  },
  UP: {
    RIGHT: 3,
    LEFT: 1,
  },
  DOWN: {
    RIGHT: 1,
    LEFT: 3,
  },
};

export const func1 = () => {
  const painted = new Set<string>();

  let head = [0, 0] as Tuple;
  let prevDir;

  let perimCut = cutArea[instructions.last()![0]][instructions[0][0]] / 4;
  while (instructions.length) {
    const [direction, stepCount] = instructions.shift()!;

    const nextHead = move2D(head, direction, stepCount);

    const cut = prevDir ? cutArea[prevDir][direction] / 4 : 0;
    perimCut += (stepCount - 1) / 2 + cut;
    console.log(prevDir, direction, cut);

    head = nextHead;
    prevDir = direction;
    painted.add(`${head[X]}=${head[Y]}`);
  }

  const mapped = [...painted].map((s) => s.numberSequence("=") as Tuple);

  const sum1 = mapped.slice(0, -1).sum(([x], i) => x * mapped[i + 1][Y]);
  const sum2 = mapped.slice(1).sum(([x], i) => x * mapped[i][Y]);
  return Math.abs(sum1 + mapped.last()![X] * mapped[0][Y] - sum2 - mapped.last()![Y] * mapped[0][X]) / 2 + perimCut;
};

const numToDir: Record<string, Direction2DOrthogonal> = {
  "0": RIGHT,
  "1": DOWN,
  "2": LEFT,
  "3": UP,
};

export const func2 = () => {
  const painted = new Set<string>();

  let head = [0, 0] as Tuple;
  let prevDir;

  let perimCut = cutArea[numToDir[instructions.last()![2].substring(6, 7)]][numToDir[instructions[0][2].substring(6, 7)]] / 4;
  while (instructions.length) {
    const color = instructions.shift()![2];
    const direction = numToDir[color.substring(6, 7)];
    const stepCount = parseInt(color.substring(1, 6), 16);

    const nextHead = move2D(head, direction, stepCount);

    const cut = prevDir ? cutArea[prevDir][direction] / 4 : 0;
    perimCut += (stepCount - 1) / 2 + cut;

    head = nextHead;
    prevDir = direction;
    painted.add(`${head[X]}=${head[Y]}`);
  }

  const mapped = [...painted].map((s) => s.numberSequence("=") as Tuple);

  const sum1 = mapped.slice(0, -1).sum(([x], i) => x * mapped[i + 1][Y]);
  const sum2 = mapped.slice(1).sum(([x], i) => x * mapped[i][Y]);
  return Math.abs(sum1 + mapped.last()![X] * mapped[0][Y] - sum2 - mapped.last()![Y] * mapped[0][X]) / 2 + perimCut;
};

952404941483;
952408144115;
