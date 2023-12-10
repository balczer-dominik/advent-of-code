import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Map2D, directions2D, getField2D, getNeighbors, move2D } from "../../util/2d";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const schematic: Map2D<string> = new Map();
raw.map((row, y) => {
  const yMap = schematic.set(y, new Map()).get(y)!;
  row.split("").forEach((symbol, x) => {
    if (symbol === ".") return;
    yMap.set(x, symbol);
  });
});

const getNumbers = () =>
  [...schematic.values()].reduce((numberCoords: Tuple[][], row, y) => {
    const buffer = [...row.entries()].reduce((acc: number[], [x, symbol]) => {
      if (!symbol.isNumber()) return acc;
      if (!acc.length || acc.last() === x - 1) return [...acc, x];
      numberCoords.push(acc.map((x) => [x, y]));
      return [x];
    }, []);

    return buffer.length ? [...numberCoords, buffer.map((x) => [x, y]) as Tuple[]] : numberCoords;
  }, []);

const buildNumber = (number: Tuple[]) =>
  number
    .map((coord) => getField2D(schematic, coord)!.toString())
    .join("")
    .toNumber();

export const func1 = () =>
  getNumbers().sum((number) =>
    number.some((field) => getNeighbors(schematic, field).some((neighbor) => !neighbor?.isNumber())) ? buildNumber(number) : 0
  );

export const func2 = () => {
  const gearCandidates: Map<string, number[]> = new Map();

  getNumbers().forEach((number) => {
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
