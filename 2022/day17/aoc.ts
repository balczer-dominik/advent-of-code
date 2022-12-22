import { writeFileSync } from "fs";
import _ from "lodash";
import { CircularIterator } from "../util/CircularIterator";
import { sortAscEx, sortDesc, sortDescEx } from "../util/helpers";
import { readInputs } from "../util/input";

//Disclaimer: Part 1 was easy enough to solve with code, part 2 however was solved by generating a map where 10000 rocks were dropped and then the solution was calculated with pen and paper and the power of CTRL + F in the generated file.

const [input, testInput] = readInputs(__dirname);

type Coord = { x: number; y: number };

type Rock = {
  coords: Coord[];
  char: string;
};

const rocks = new CircularIterator(
  {
    coords: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ],
    char: "~",
  },
  {
    coords: [
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 6 },
    ],
    char: "+",
  },
  {
    coords: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 5, y: 6 },
    ],
    char: "L",
  },
  {
    coords: [
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 3, y: 7 },
    ],
    char: "@",
  },
  {
    coords: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
    ],
    char: "#",
  }
);

const func1 = (input: string[], rockCount: number) => {
  let gusts = new CircularIterator<">" | "<">(
    ...(input[0].split("") as (">" | "<")[])
  );
  let highestY = 0;

  const occupied: Map<number, { x: number; char: string }[]> = new Map();
  const toPrint: string[] = [];

  for (let rocksDropped = 0; rocksDropped < rockCount; rocksDropped++) {
    const rockToDrop = _.cloneDeep(rocks.next());
    moveRockUp(rockToDrop, highestY);

    let stopped = false;

    while (!stopped) {
      const gustMove = gusts.next();
      blowRock(rockToDrop, occupied, gustMove);

      stopped = dropRock(rockToDrop, occupied);
    }

    const newHighestY = getHighestYOnRock(rockToDrop);

    highestY = newHighestY > highestY ? newHighestY : highestY;
    rockToDrop.coords.forEach((coord) =>
      occupied.set(coord.y, [
        ...(occupied.get(coord.y) ?? []),
        { x: coord.x, char: rockToDrop.char },
      ])
    );

    toPrint.push(`${rocksDropped}\t${highestY}`);
  }

  printStat(toPrint);

  return [...occupied.keys()].sort(sortDesc)[0];
};

const getHighestYOnRock = (rock: Rock) => {
  const sorted = _.cloneDeep(rock).coords.sort(sortDescEx((t) => t.y));
  return sorted[0].y;
};

const moveRockUp = (rock: Rock, by: number) => {
  rock.coords.forEach((c) => (c.y += by));
};

const blowRock = (
  rock: Rock,
  occupied: Map<number, { x: number; char: string }[]>,
  direction: "<" | ">"
) => {
  const offset = direction === ">" ? 1 : -1;

  if (offset === -1 && rock.coords[0].x === 1) {
    return;
  }

  if (offset === 1 && rock.coords[3].x === 7) {
    return;
  }

  const wouldBeRock = _.cloneDeep(rock);
  wouldBeRock.coords.forEach((c) => (c.x += offset));

  let conflicts = false;
  wouldBeRock.coords
    .map((c) => c.y)
    .forEach((y) => {
      if (conflicts) {
        return;
      }

      const occupiedRow = occupied.get(y);
      if (!occupiedRow) {
        return;
      }
      const rocksXsOnY = wouldBeRock.coords
        .filter((c) => c.y === y)
        .map((c) => c.x);
      conflicts = occupiedRow.some((x) => rocksXsOnY.includes(x.x));
    });

  if (!conflicts) {
    rock.coords.forEach((c) => (c.x += offset));
  }
};

const dropRock = (
  rock: Rock,
  occupied: Map<number, { x: number; char: string }[]>
): boolean => {
  const newLowestY =
    _.cloneDeep(rock.coords).sort(sortAscEx((c) => c.y))[0].y - 1;

  if (newLowestY === 0) {
    return true;
  }

  const canGoDown = rock.coords.every((coord) => {
    const occupiedRow = occupied.get(coord.y - 1);
    if (!occupiedRow) {
      return true;
    }
    return occupiedRow.every((o) => o.x !== coord.x);
  });

  if (canGoDown) {
    rock.coords.forEach((c) => (c.y -= 1));
    return false;
  }

  return true;
};

const printMap = (
  occupied: Map<number, { x: number; char: string }[]>,
  highestY: number
) => {
  for (let y = highestY + 7; y >= 0; y--) {
    if (y < 220) {
      continue;
    }
    if (y === 0) {
      console.log("+-------+");
      continue;
    }
    const row = occupied.get(y) ?? [];
    console.log(
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((x) =>
          x < 8 && x > 0 ? row.find((o) => o.x === x)?.char ?? "." : "|"
        )
        .join("")
    );
  }
};

const printMapToFile = (
  occupied: Map<number, { x: number; char: string }[]>,
  highestY: number
) => {
  let rows: string[] = [];
  for (let y = highestY + 7; y >= 0; y--) {
    if (y === 0) {
      rows.push("+-------+");
      continue;
    }
    const row = occupied.get(y) ?? [];
    rows.push(
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((x) =>
          x < 8 && x > 0 ? row.find((o) => o.x === x)?.char ?? "." : "|"
        )
        .join("")
    );
  }
  writeFileSync("output.txt", rows.join("\n"));
};

const func2 = (input: string[]) => {
  let gusts = new CircularIterator<">" | "<">(
    ...(input[0].split("") as (">" | "<")[])
  );
  let highestY = 0;

  const occupied: Map<number, { x: number; char: string }[]> = new Map();

  let i = 0;
  while (i++ < 2022) {
    const rockToDrop = _.cloneDeep(rocks.next());
    moveRockUp(rockToDrop, highestY);

    while (true) {
      const gustMove = gusts.next();
      blowRock(rockToDrop, occupied, gustMove);

      if (dropRock(rockToDrop, occupied)) {
        break;
      }
    }

    const newHighestY = getHighestYOnRock(rockToDrop);

    highestY = newHighestY > highestY ? newHighestY : highestY;
    rockToDrop.coords.forEach((coord) =>
      occupied.set(coord.y, [
        ...(occupied.get(coord.y) ?? []),
        { x: coord.x, char: rockToDrop.char },
      ])
    );

    const pattern = findPattern(occupied);

    console.table({ rocksPlaced: i, height: highestY, pattern });
  }
};

const findPattern = (occupied: Map<number, { x: number; char: string }[]>) => {
  const sortedOccupied = [...occupied].sort(sortAscEx((i) => i[0]));

  let bestCandidate: {
    start: number;
    proofStart: number;
    height: number;
  } = { start: 0, proofStart: 0, height: 0 };

  for (const [startY, startXs] of sortedOccupied) {
    const sorted = _.sortBy(
      sortedOccupied
        .filter(
          ([compareStartY, compareStartXs]) =>
            compareStartY * 2 - startY - 1 <= sortedOccupied.length &&
            compareStartY > startY + 10 &&
            _.isEqual(
              _.sortBy(startXs, (d) => d.x),
              _.sortBy(compareStartXs, (d) => d.x)
            )
        )
        .filter(([candidateStartY]) => {
          const length = candidateStartY - startY;
          for (let row = 0; row < length; row++) {
            if (
              !_.isEqual(
                _.sortBy(occupied.get(startY + row), (d) => d.x),
                _.sortBy(occupied.get(candidateStartY + row), (d) => d.x)
              )
            ) {
              return false;
            }
          }
          return true;
        }),
      ([candidateStartY]) => candidateStartY - startY
    );

    if (
      sorted.length > 0 &&
      sorted[sorted.length - 1][0] - startY > bestCandidate.height
    ) {
      bestCandidate = {
        start: startY,
        proofStart: sorted[sorted.length - 1][0],
        height: sorted[sorted.length - 1][0] - startY,
      };
    }
  }

  return bestCandidate;
};

function printStat(toPrint: string[]) {
  writeFileSync("out_stat.txt", toPrint.join("\n"));
}

console.log(func1(input, 2020));
