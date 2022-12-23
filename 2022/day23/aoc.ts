import { Direction2D, Direction2DOrthogonal, directions2D, DOWN, LEFT, LOWER_LEFT, LOWER_RIGHT, Map2D, offset2D, RIGHT, UP, UPPER_LEFT, UPPER_RIGHT } from "../util/2d";
import { maxReduce, minReduce } from "../util/helpers";
import { readInputs } from "../util/input";
import { Tuple, X, Y } from "../util/Tuple";

const [input, testInput] = readInputs(__dirname);

type MovePlan = {
  moveTo: Direction2DOrthogonal,
  neighboursToCheck: Direction2D[]
}

type ElfMove = {
  elfIdx: number,
  from: Tuple,
  to: Tuple
}

const defaultMovePlans: MovePlan[] = [
  { moveTo: UP, neighboursToCheck: [UP, UPPER_RIGHT, UPPER_LEFT] },
  { moveTo: DOWN, neighboursToCheck: [DOWN, LOWER_LEFT, LOWER_RIGHT] },
  { moveTo: LEFT, neighboursToCheck: [LEFT, UPPER_LEFT, LOWER_LEFT] },
  { moveTo: RIGHT, neighboursToCheck: [RIGHT, UPPER_RIGHT, LOWER_RIGHT] },
]

const parseInput = (input: string[]) => {
  const elfs: Map2D<number> = new Map();

  let elfIdx = 0
  input.forEach((row, rowIdx) => {
    let rowMap = elfs.get(rowIdx);

    if (!rowMap) {
      rowMap = new Map();
      elfs.set(rowIdx, rowMap)
    }

    row.split("").forEach((field, colIdx) => {
      if (field === "#") {
        rowMap!.set(colIdx, elfIdx)
        elfIdx++;
      }
    })
  })

  return elfs;
};

const getProposedMoves = (elfs: Map2D<number>, movePlans: MovePlan[]): ElfMove[] => {
  let moves: ElfMove[] = []

  elfs.forEach((row, rowIdx) => row.forEach((elfIdx, colIdx) => {
    const neighbours = directions2D.map(neighbourDir => {
      const [offsetX, offsetY] = offset2D[neighbourDir];
      const [neighbourX, neighbourY] = [colIdx + offsetX, rowIdx + offsetY];

      return { dir: neighbourDir, empty: !elfs.get(neighbourY)?.has(neighbourX) }
    });

    if (neighbours.every(n => n.empty)) {
      return;
    }

    for (let movePlan of movePlans) {
      if (movePlan.neighboursToCheck.every((dir) => neighbours.filter(n => n.dir === dir)[0].empty)) {
        const [offsetX, offsetY] = offset2D[movePlan.moveTo];
        const [neighbourX, neighbourY] = [colIdx + offsetX, rowIdx + offsetY];
        moves.push({ from: [colIdx, rowIdx], to: [neighbourX, neighbourY], elfIdx })
        break;
      }
    }
  }))

  return moves;
}

const func1 = (input: string[]) => {
  const elfs = parseInput(input);

  const movePlans = defaultMovePlans;

  let sol = 0;

  for (let round = 0; round < 10; round++) {
    const elfMoves = getProposedMoves(elfs, movePlans);

    elfMoves.forEach(move => {
      if (elfMoves.some(otherMove => otherMove.elfIdx !== move.elfIdx && otherMove.to[X] === move.to[X] && otherMove.to[Y] === move.to[Y])) {
        return;
      }

      elfs.get(move.from[Y])!.delete(move.from[X]);
      let newRow = elfs.get(move.to[Y]);

      if (!newRow) {
        newRow = new Map();
        elfs.set(move.to[Y], newRow);
      }

      newRow.set(move.to[X], move.elfIdx)
    })

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

    elfMoves.forEach(move => {
      if (elfMoves.some(otherMove => otherMove.elfIdx !== move.elfIdx && otherMove.to[X] === move.to[X] && otherMove.to[Y] === move.to[Y])) {
        moveCount--;
        return;
      }

      elfs.get(move.from[Y])!.delete(move.from[X]);
      let newRow = elfs.get(move.to[Y]);

      if (!newRow) {
        newRow = new Map();
        elfs.set(move.to[Y], newRow);
      }

      newRow.set(move.to[X], move.elfIdx)
    })

    const newLast = movePlans.splice(0, 1)[0];
    movePlans.push(newLast);
    rounds++;
  }

  return rounds + 1;
};

const getEmptyFields = (elfs: Map2D<number>): number => {
  const elfCoords = [...elfs.entries()].flatMap(([y, row]) =>
    [...row.keys()].map(x => [x, y] as Tuple)
  )

  const lowerX = elfCoords.map(e => e[X]).reduce(minReduce)
  const lowerY = elfCoords.map(e => e[Y]).reduce(minReduce)
  const upperX = elfCoords.map(e => e[X]).reduce(maxReduce)
  const upperY = elfCoords.map(e => e[Y]).reduce(maxReduce)

  return (upperY - lowerY + 1) * (upperX - lowerX + 1) - elfCoords.length
}

console.log(1, func1(input));
console.log(2, func2(input));
