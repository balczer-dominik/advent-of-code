import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Map2D, directions2D, getField2D, getNeighbors, move2D } from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const parseInput = () => {
  const raw = TEST ? testInput : input;

  const split = raw.map((row) => row.split(""));

  const schematic: Map2D<string | number> = new Map();
  split.forEach((_, y) => schematic.set(y, new Map()));

  split.forEach((row, y) =>
    row.forEach((symbol, x) => {
      if (symbol === ".") return;
      schematic.get(y)!.set(x, isNaN(parseInt(symbol)) ? symbol : parseInt(symbol));
    })
  );

  return schematic;
};
const schematic = parseInput();

const getNumbers = () => {
  let candidates: Tuple[][] = [];

  schematic.forEach((row, y) => {
    let buffer: number[] = [];
    let last: number;
    row.forEach((symbol, x) => {
      if (typeof symbol === "string") return;

      if (last === undefined) {
        buffer.push(x);
      } else {
        if (last === x - 1) {
          buffer.push(x);
        } else {
          candidates.push(buffer.map((x) => [x, y]));
          buffer = [x];
        }
      }
      last = x;
    });

    if (!buffer.isEmpty()) candidates.push(buffer.map((x) => [x, y]));
  });

  return candidates;
};

const buildNumber = (number: Tuple[]) => parseInt(number.map((coord) => getField2D(schematic, coord)!.toString()).join(""));

export const func1 = () => {
  const numbers = getNumbers();

  return numbers.reduce((acc, number) => {
    const isValid = number.some((field) => getNeighbors(schematic, field).some((neighbor) => typeof neighbor === "string"));
    return acc + (isValid ? buildNumber(number) : 0);
  }, 0);
};

export const func2 = () => {
  const numbers = getNumbers();

  const gearCandidates: Map<string, number[]> = new Map();

  numbers.forEach((number) => {
    const adjacentGears: Set<string> = new Set();

    number.forEach((digitCoord) =>
      directions2D
        .map((direction) => move2D(digitCoord, direction))
        .forEach((neighborCoord) => {
          if (getField2D(schematic, neighborCoord) === "*") {
            adjacentGears.add(`[${neighborCoord[X]},${neighborCoord[Y]}]`);
          }
        })
    );

    adjacentGears.forEach((gearCoord) => {
      gearCandidates.set(gearCoord, [...(gearCandidates.get(gearCoord) ?? []), buildNumber(number)]);
    });
  });

  return [...gearCandidates.values()].reduce((result, gear) => (result += gear.length === 2 ? gear[0] * gear[1] : 0), 0);
};
