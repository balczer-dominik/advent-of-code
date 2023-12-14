import { readInputs } from "../../util/input";
import "../../util/helpers";
import _, { map } from "lodash";
import { Tuple, X, Y } from "../../util/Tuple";
import { CircularIterator } from "../../util/CircularIterator";
import { DeflateRaw } from "zlib";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const rounded = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => c === "O" ? [[x, y]] : []))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);
const block = raw
  .flatMap((row, y) => row.split("").flatMap((c, x) => c === "#" ? [[x, y]] : []))
  .sort((a, b) => a[X] - b[X])
  .sort((a, b) => a[Y] - b[Y]);

export const func1 = () => {
  return _.range(0, raw[0].length).map(x => {
    const aggregated = rounded
      .filter(([rockX, rockY]) => rockX === x)
      .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockX === rockX && blockY < rockY).last()?.at(Y) ?? -1) + 1)
      .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

    return Object.entries(aggregated).sum(([foundation, quantity]) => _.rangeRight(raw[0].length - parseInt(foundation), raw[0].length - parseInt(foundation) - quantity).sum())
  }).sum()
};

export const func2 = () => {
  const patterns: string[] = []
  const iter = new CircularIterator(0, 1, 2, 3)

  let state = rounded;

  while (true) {
    let dir = iter.next();

    switch (dir) {
      //UP
      case 0: {
        const newState = _.range(0, raw[0].length).flatMap(x => {
          const aggregated = state
            .filter(([rockX]) => rockX === x)
            .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockX === rockX && blockY < rockY).last()?.at(Y) ?? -1) + 1)
            .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

          return Object.entries(aggregated).flatMap(([foundation, quantity]) => _.range(parseInt(foundation), parseInt(foundation) + quantity).map(y => [x, y]))
        })
        state = newState;
      }
        break;
      //LEFT
      case 1: {
        const newState = _.range(0, raw.length).flatMap(y => {
          const aggregated = state
            .filter(([_, rockY]) => rockY === y)
            .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockY === rockY && blockX < rockX).last()?.at(X) ?? -1) + 1)
            .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

          return Object.entries(aggregated).flatMap(([foundation, quantity]) => _.range(parseInt(foundation), parseInt(foundation) + quantity).map(x => [x, y]))
        })
        state = newState;
      }
        break;
      //DOWN
      case 2: {
        const newState = _.range(0, raw[0].length).flatMap(x => {
          const aggregated = state
            .filter(([rockX]) => rockX === x)
            .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockX === rockX && blockY > rockY)[0]?.at(Y) ?? raw.length))
            .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})

          return Object.entries(aggregated).flatMap(([foundation, quantity]) => _.range(parseInt(foundation) - (quantity), parseInt(foundation)).map(y => [x, y]))
        })
        state = newState;
      }
        break;
      //RIGHT
      case 3: {
        const newState = _.range(0, raw.length).flatMap(y => {
          const aggregated = state
            .filter(([_, rockY]) => rockY === y)
            .map(([rockX, rockY]) => (block.filter(([blockX, blockY]) => blockY === rockY && blockX > rockX)[0]?.at(X) ?? raw.length))
            .reduce((acc: { [key: number]: number }, foundation) => ({ ...acc, [foundation]: (acc[foundation] ?? 0) + 1 }), {})


          return Object.entries(aggregated).flatMap(([foundation, quantity]) => _.range(parseInt(foundation) - (quantity), parseInt(foundation)).map(x => [x, y]))
        })
        state = newState;
      }
    }

    const stringified = JSON.stringify(state);

    if (dir === 3) {
      if (patterns.includes(stringified)) {
        const loopSize = patterns.length - patterns.lastIndexOf(stringified);
        const offset = patterns.length - loopSize;
        console.log(`loopSize: ${loopSize}`)
        console.log(`offset: ${offset}`)

        let last = 0;
        for (let i = offset; i < 1000000000; i += loopSize)
          last = i;
        console.log(`last: ${last}`)

        const finalIndexInLoop = 1000000000 - last;
        console.log(`finalIndexInLoop: ${finalIndexInLoop}`)

        console.log(finalIndexInLoop + offset)

        const final = patterns[finalIndexInLoop + offset - 1]
        const parsed = JSON.parse(final) as Tuple[]

        printMap(parsed)

        // return patterns.map(pattern => (JSON.parse(pattern) as Tuple[]).sum(([x, y]) => raw.length - y))
        return parsed.sum(([x, y]) => raw.length - y)
      }
      patterns.push(stringified);
    }
  }
};

const printMap = (rounded: Tuple[]) => {
  let res = ""
  for (let y = 0; y < raw.length; y++) {
    for (let x = 0; x < raw[0].length; x++) {
      const round = rounded.some(([rx, ry]) => rx === x && ry === y)
      const blocky = block.some(([rx, ry]) => rx === x && ry === y)
      if (round) res = res + "O"
      if (blocky) res = res + "#"

      if (!round && !blocky) res = res + "."
    }
    res = res + "\n"
  }

  console.log(res)
}
