import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Map2D, directions2D, getField2D, getNeighbors, move2D } from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const split = raw.map((row) => row.split(""));

const schematic: Map2D<string> = new Map();
split.forEach((_, y) => schematic.set(y, new Map()));

split.forEach((row, y) =>
  row.forEach((symbol, x) => {
    if (symbol === ".") return;
    schematic.get(y)!.set(x, symbol);
  })
);

const getNumbers = () =>
  [...schematic.values()].reduce((numberCoords: Tuple[][], row, y) => {
    let buffer: number[] = [];

    row.forEach((symbol, x) => {
      if (!symbol.isNumber()) return;

      if (!buffer.length || buffer.last() === x - 1) {
        buffer.push(x);
      } else {
        numberCoords.push(buffer.map((x) => [x, y]));
        buffer = [x];
      }
    });

    return buffer.length ? [...numberCoords, buffer.map((x) => [x, y]) as Tuple[]] : numberCoords;
  }, []);

const buildNumber = (number: Tuple[]) =>
  number
    .map((coord) => getField2D(schematic, coord)!.toString())
    .join("")
    .toNumber();

export const func1 = () =>
  getNumbers().reduce(
    (acc, number) =>
      acc + (number.some((field) => getNeighbors(schematic, field).some((neighbor) => !neighbor?.isNumber())) ? buildNumber(number) : 0),
    0
  );

export const func2 = () => {
  const numbers = getNumbers();

  const gearCandidates: Map<string, number[]> = new Map();

  numbers.forEach((number) => {
    const adjacentGears: Set<string> = new Set();

    number.forEach((digitCoord) =>
      directions2D
        .map((direction) => move2D(digitCoord, direction))
        .filter((neighborCoord) => getField2D(schematic, neighborCoord) === "*")
        .forEach((neighborCoord) => adjacentGears.add(`[${neighborCoord[X]},${neighborCoord[Y]}]`))
    );

    adjacentGears.forEach((gearCoord) => {
      gearCandidates.set(gearCoord, [...(gearCandidates.get(gearCoord) ?? []), buildNumber(number)]);
    });
  });

  return [...gearCandidates.values()].sum((gear) => (gear.length === 2 ? gear[0] * gear[1] : 0));
};
