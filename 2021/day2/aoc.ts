import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Direction2DOrthogonal, move2D } from "../../util/2d";
import { Triplet, Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const moveToDirection: Record<string, Direction2DOrthogonal> = {
  forward: "RIGHT",
  up: "UP",
  down: "DOWN",
};

const instructions = raw.map((r) => {
  const split = r.split(" ");
  return { direction: moveToDirection[split[0]], by: parseInt(split[1]) };
});

export const func1 = () => instructions.reduce((pos: Tuple, { direction, by }) => move2D(pos, direction, by), [0, 0]).product();

export const func2 = () =>
  instructions
    .reduce(
      ([aim, x, y]: Triplet, { direction, by }) => {
        if (direction === "DOWN") return [aim + by, x, y] as Triplet;
        if (direction === "UP") return [aim - by, x, y] as Triplet;
        return [aim, x + by, y + by * aim] as Triplet;
      },
      [0, 0, 0]
    )
    .slice(1, 3)
    .product();
