import {
  Direction2D,
  Direction2DOrthogonal,
  directions2D,
  DOWN,
  LEFT,
  LOWER_LEFT,
  LOWER_RIGHT,
  Map2D,
  offset2D,
  RIGHT,
  UP,
  UPPER_LEFT,
  UPPER_RIGHT,
} from "../../util/2d";
import "../../util/helpers";
import { readInputs } from "../../util/input";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);

type MovePlan = {
  moveTo: Direction2DOrthogonal;
  neighborsToCheck: Direction2D[];
};

type ElfMove = {
  elfIdx: number;
  from: Tuple;
  to: Tuple;
};

const defaultMovePlans: MovePlan[] = [
  { moveTo: UP, neighborsToCheck: [UP, UPPER_RIGHT, UPPER_LEFT] },
  { moveTo: DOWN, neighborsToCheck: [DOWN, LOWER_LEFT, LOWER_RIGHT] },
  { moveTo: LEFT, neighborsToCheck: [LEFT, UPPER_LEFT, LOWER_LEFT] },
  { moveTo: RIGHT, neighborsToCheck: [RIGHT, UPPER_RIGHT, LOWER_RIGHT] },
];

const parseInput = (input: string[]) => {
  const elfs: Map2D<number> = new Map();

  let elfIdx = 0;
  input.forEach((row, rowIdx) => {
    let rowMap = elfs.get(rowIdx);

    if (!rowMap) {
      rowMap = new Map();
      elfs.set(rowIdx, rowMap);
    }

    row.split("").forEach((field, colIdx) => {
      if (field === "#") {
        rowMap!.set(colIdx, elfIdx);
        elfIdx++;
      }
    });
  });

  return elfs;
};

const getProposedMoves = (elfs: Map2D<number>, movePlans: MovePlan[]): ElfMove[] => {
  let moves: ElfMove[] = [];

  elfs.forEach((row, rowIdx) =>
    row.forEach((elfIdx, colIdx) => {
      const neighbors = directions2D.map((neighborDir) => {
        const [offsetX, offsetY] = offset2D[neighborDir];
        const [neighborX, neighborY] = [colIdx + offsetX, rowIdx + offsetY];

        return {
          dir: neighborDir,
          empty: !elfs.get(neighborY)?.has(neighborX),
        };
      });

      if (neighbors.every((n) => n.empty)) {
        return;
      }

      for (let movePlan of movePlans) {
        if (movePlan.neighborsToCheck.every((dir) => neighbors.filter((n) => n.dir === dir)[0].empty)) {
          const [offsetX, offsetY] = offset2D[movePlan.moveTo];
          const [neighborX, neighborY] = [colIdx + offsetX, rowIdx + offsetY];
          moves.push({
            from: [colIdx, rowIdx],
            to: [neighborX, neighborY],
            elfIdx,
          });
          break;
        }
      }
    })
  );

  return moves;
};

const func1 = (input: string[]) => {
  const elfs = parseInput(input);

  const movePlans = defaultMovePlans;

  let sol = 0;

  for (let round = 0; round < 10; round++) {
    const elfMoves = getProposedMoves(elfs, movePlans);

    elfMoves.forEach((move) => {
      if (
        elfMoves.some((otherMove) => otherMove.elfIdx !== move.elfIdx && otherMove.to[X] === move.to[X] && otherMove.to[Y] === move.to[Y])
      ) {
        return;
      }

      elfs.get(move.from[Y])!.delete(move.from[X]);
      let newRow = elfs.get(move.to[Y]);

      if (!newRow) {
        newRow = new Map();
        elfs.set(move.to[Y], newRow);
      }

      newRow.set(move.to[X], move.elfIdx);
    });

    movePlans.push(movePlans.splice(0, 1)[0]);

    sol = getEmptyFields(elfs);
  }

  return sol;
};

const func2 = (input: string[]) => {
  const elfs = parseInput(input);

  const movePlans = defaultMovePlans;

  let moveCount = 1;
  let rounds = 0;
  while (moveCount > 0) {
    const elfMoves = getProposedMoves(elfs, movePlans);
    moveCount = elfMoves.length;

    elfMoves.forEach((move) => {
      if (
        elfMoves.some((otherMove) => otherMove.elfIdx !== move.elfIdx && otherMove.to[X] === move.to[X] && otherMove.to[Y] === move.to[Y])
      ) {
        moveCount--;
        return;
      }

      elfs.get(move.from[Y])!.delete(move.from[X]);
      let newRow = elfs.get(move.to[Y]);

      if (!newRow) {
        newRow = new Map();
        elfs.set(move.to[Y], newRow);
      }

      newRow.set(move.to[X], move.elfIdx);
    });

    const newLast = movePlans.splice(0, 1)[0];
    movePlans.push(newLast);
    rounds++;
  }

  return rounds + 1;
};

const getEmptyFields = (elfs: Map2D<number>): number => {
  const elfCoords = [...elfs.entries()].flatMap(([y, row]) => [...row.keys()].map((x) => [x, y] as Tuple));

  const lowerX = elfCoords.min((e) => e[X]);
  const lowerY = elfCoords.min((e) => e[Y]);
  const upperX = elfCoords.max((e) => e[X]);
  const upperY = elfCoords.max((e) => e[Y]);

  return (upperY - lowerY + 1) * (upperX - lowerX + 1) - elfCoords.length;
};

console.log(1, func1(input));
console.log(2, func2(input));
