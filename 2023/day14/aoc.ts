import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const rounded = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => (c === "O" ? [[x, y]] : [])))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);
const block = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => (c === "#" ? [[x, y]] : [])))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);

export const func1 = () => tiltMap(rounded, "X", "FRONT").sum(([_, y]) => raw.length - y);

const tiltMap = (roundedRocks: number[][], axis: "X" | "Y", direction: "FRONT" | "BACK") => {
  return _.range(0, axis === "X" ? raw[0].length : raw.length).flatMap((baseCoord) => {
    const aggregated = roundedRocks
      .filter(([rockX, rockY]) => (axis === "X" && rockX === baseCoord) || (axis === "Y" && rockY === baseCoord))
      .map(
        ([rockX, rockY]) =>
          (block
            .filter(
              ([blockX, blockY]) =>
                (axis === "X" &&
                  blockX === rockX &&
                  ((direction === "FRONT" && blockY < rockY) || (direction === "BACK" && blockY > rockY))) ||
                (axis === "Y" &&
                  blockY === rockY &&
                  ((direction === "FRONT" && blockX < rockX) || (direction === "BACK" && blockX > rockX)))
            )
            .slice(direction === "FRONT" ? -1 : 0)[0]
            ?.at(axis === "X" ? Y : X) ?? +(direction === "FRONT" ? -1 : raw.length)) + (direction === "FRONT" ? 1 : 0)
      )
      .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {});

    return Object.entries(aggregated).flatMap(([foundation, quantity]) =>
      _.range(
        parseInt(foundation) - (direction === "FRONT" ? 0 : quantity),
        parseInt(foundation) + (direction === "BACK" ? 0 : quantity)
      ).map((newCoord) => (axis === "X" ? [baseCoord, newCoord] : [newCoord, baseCoord]))
    );
  });
};

export const func2 = () => {
  let state = rounded;
  const patterns: string[] = [];

  while (true) {
    state = [0, 1, 2, 3].reduce((currState: typeof state, dir) => {
      switch (dir) {
        case 0:
          return tiltMap(currState, "X", "FRONT");
        case 1:
          return tiltMap(currState, "Y", "FRONT");
        case 2:
          return tiltMap(currState, "X", "BACK");
        case 3:
          return tiltMap(currState, "Y", "BACK");
        default:
          throw new Error("Invalid dir");
      }
    }, state);

    const stringified = JSON.stringify(state);
    if (patterns.includes(stringified)) {
      const loopSize = patterns.length - patterns.lastIndexOf(stringified);
      const patternIdx = ((1000000000 - patterns.length - loopSize) % loopSize) + patterns.length - loopSize - 1;
      const parsed = JSON.parse(patterns[patternIdx]) as Tuple[];
      return parsed.sum(([_, y]) => raw.length - y);
    }

    patterns.push(stringified);
  }
};
