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

const numToDir: Record<string, Direction2DOrthogonal> = {
  "0": RIGHT,
  "1": DOWN,
  "2": LEFT,
  "3": UP,
};

export const getPaintedArea = (steps: [Direction2DOrthogonal, number][]) => {
  const perimeterCut = steps.sum(([_, stepCount]) => (stepCount - 1) / 2);
  const [points] = steps.reduce(
    ([points, head]: [Tuple[], Tuple], [direction, stepCount]) => [[...points, head], move2D(head, direction, stepCount)],
    [[], [0, 0]]
  );
  return shoelace(points) + perimeterCut + steps.length / 2 + 1;
};

export const func1 = () => getPaintedArea(instructions.map(([direction, stepCount]) => [direction, stepCount]));
export const func2 = () =>
  getPaintedArea(
    instructions.map((instruction) => [numToDir[instruction[2].substring(6, 7)], parseInt(instruction[2].substring(1, 6), 16)])
  );
