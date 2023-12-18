import { readInputs } from "../../util/input";
import "../../util/helpers";
import { DOWN, Direction2DOrthogonal, Direction2DShort, LEFT, RIGHT, UP, move2D, parseShortDirection2D, shoelace } from "../../util/2d";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const instructions = raw.map((row) => {
  const [direction, count, color] = row.split(" ");
  return [parseShortDirection2D[direction as Direction2DShort], parseInt(count), color.slice(1, 8)] as const;
});

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

const numToDir: Record<string, Direction2DOrthogonal> = {
  "0": RIGHT,
  "1": DOWN,
  "2": LEFT,
  "3": UP,
};

export const getPaintedArea = (steps: [Direction2DOrthogonal, number][]) => {
  let head: Tuple = [0, 0];
  let prevDir = steps.last()![0];
  let perimeterCut = 0;

  const points = steps.map(([direction, stepCount]) => {
    perimeterCut += (stepCount - 1) / 2 + cutArea[prevDir][direction] / 4;
    prevDir = direction;
    head = move2D(head, direction, stepCount);
    return head;
  });

  return shoelace(points) + perimeterCut;
};

export const func1 = () => getPaintedArea(instructions.map(([direction, stepCount]) => [direction, stepCount]));
export const func2 = () =>
  getPaintedArea(
    instructions.map((instruction) => [numToDir[instruction[2].substring(6, 7)], parseInt(instruction[2].substring(1, 6), 16)])
  );