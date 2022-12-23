import {
  Direction2DOrthogonal,
  Direction2DShort,
  DOWN,
  getField2D,
  LEFT,
  Map2D,
  offset2D,
  opposite2D,
  parseShortDirection2D,
  RIGHT,
  Turn2D,
  turnDirection2DOrthogonal,
  UP,
} from "../util/2d";
import { minReduce, simpleParseInt } from "../util/helpers";
import { readInputs } from "../util/input";
import { abcMatcher, numericMatcher } from "../util/regex";
import { Triplet, Tuple, X, Y } from "../util/Tuple";

const [input, testInput] = readInputs(__dirname);

const WALL = "#";
const TILE = ".";
const VOID = " ";

type Field = typeof WALL | typeof TILE;
type Instruction = Turn2D | number;
type WrappingFunction = (
  map: Map2D<Field>,
  currSpot: Tuple,
  currDir: Direction2DOrthogonal
) => { fieldOnNewSpot: Field; newSpot: Tuple; newDir: Direction2DOrthogonal };

const parseInput = (input: string[]) => {
  const map: Map2D<Field> = new Map();

  const mapInput = input.slice(0, input.length - 2);
  const instructionsInput = input.last()!;

  mapInput.forEach((row, rowIdx) => {
    let rowMap = map.get(rowIdx);

    if (!rowMap) {
      rowMap = new Map<number, Field>();
      map.set(rowIdx, rowMap);
    }

    row.split("").forEach((field, fieldIdx) => {
      if (field === VOID) {
        return;
      } else {
        rowMap!.set(fieldIdx, field as Field);
      }
    });
  });

  const turns = instructionsInput.match(abcMatcher)!;
  const steps = instructionsInput.match(numericMatcher)!.map(simpleParseInt);
  const instructions: Instruction[] = [];

  turns.forEach((turn, idx) => {
    instructions.push(steps[idx]);
    instructions.push(
      parseShortDirection2D[turn as Direction2DShort] as Turn2D
    );
  });
  instructions.push(steps.last()!);

  return { map, instructions };
};

const wrapAround: WrappingFunction = (
  map: Map2D<Field>,
  currSpot: Tuple,
  currDir: Direction2DOrthogonal
) => {
  const [offsetX, offsetY] = offset2D[opposite2D[currDir]];

  let iterSpot = currSpot;

  while (true) {
    const nextSpot = [iterSpot[X] + offsetX, iterSpot[Y] + offsetY] as Tuple;
    const fieldOnNextSpot = getField2D(map, nextSpot);

    if (!fieldOnNextSpot) {
      return {
        fieldOnNewSpot: getField2D(map, iterSpot)!,
        newSpot: iterSpot,
        newDir: currDir,
      };
    }

    iterSpot = nextSpot;
  }
};

const wrapAroundCube: WrappingFunction = (
  map: Map2D<Field>,
  [previousSpotX, previousSpotY]: Tuple,
  direction: Direction2DOrthogonal
): { fieldOnNewSpot: Field; newSpot: Tuple<number>; newDir: Direction2DOrthogonal } => {
  let newSpot: Tuple;
  let newDir: Direction2DOrthogonal;

  switch (direction) {
    case UP:
      {
        if (previousSpotX < 50) {
          //5->3
          newSpot = [50, previousSpotX + 50];
          newDir = RIGHT;
        } else if (previousSpotX < 100) {
          //2->6
          newSpot = [0, previousSpotX + 100];
          newDir = RIGHT;
        } else {
          //1->6
          newSpot = [previousSpotX - 100, 199];
          newDir = UP;
        }
      }
      break;
    case RIGHT:
      {
        if (previousSpotY < 50) {
          //1->4
          newSpot = [99, Math.abs(previousSpotY - 100) + 49];
          newDir = LEFT;
        } else if (previousSpotY < 100) {
          //3->1
          newSpot = [previousSpotY + 50, 49];
          newDir = UP;
        } else if (previousSpotY < 150) {
          //4->1
          newSpot = [149, Math.abs(150 - previousSpotY) - 1];
          newDir = LEFT;
        } else {
          //6->4
          newSpot = [previousSpotY - 100, 149];
          newDir = UP;
        }
      }
      break;
    case DOWN:
      {
        if (previousSpotX < 50) {
          //6->1
          newSpot = [previousSpotX + 100, 0];
          newDir = DOWN;
        } else if (previousSpotX < 100) {
          //4->6
          newSpot = [49, previousSpotX + 100];
          newDir = LEFT;
        } else {
          //1->3
          newSpot = [99, previousSpotX - 50];
          newDir = LEFT;
        }
      }
      break;
    case LEFT: {
      if (previousSpotY < 50) {
        //2->5
        newSpot = [0, Math.abs(previousSpotY - 100) + 49];
        newDir = RIGHT;
      } else if (previousSpotY < 100) {
        //3->5
        newSpot = [previousSpotY - 50, 100];
        newDir = DOWN;
      } else if (previousSpotY < 150) {
        //5->2
        newSpot = [50, Math.abs(150 - previousSpotY) - 1];
        newDir = RIGHT;
      } else {
        //6->2
        newSpot = [previousSpotY - 100, 0];
        newDir = DOWN;
      }
    }
  }

  return { newSpot, newDir, fieldOnNewSpot: getField2D(map, newSpot)! };
};

const traverse = (
  map: Map2D<Field>,
  instructions: Instruction[],
  wrapAround: WrappingFunction
): Triplet => {
  let currDir: Direction2DOrthogonal = RIGHT;
  let currSpot: Tuple = [[...map.get(0)!.keys()].reduce(minReduce), 0];

  instructions.forEach((instruction) => {
    if (typeof instruction === "number") {
      for (let step = 0; step < instruction; step++) {
        const [offsetX, offsetY] = offset2D[currDir];
        let newSpot: Tuple = [currSpot[X] + offsetX, currSpot[Y] + offsetY];
        let fieldOnNewSpot = getField2D(map, newSpot);
        let newDir = currDir;

        if (!fieldOnNewSpot) {
          const wrappedSpot = wrapAround(map, currSpot, currDir);
          newSpot = wrappedSpot.newSpot;
          fieldOnNewSpot = wrappedSpot.fieldOnNewSpot;
          newDir = wrappedSpot.newDir;
        }

        if (fieldOnNewSpot === WALL) {
          break;
        } else {
          currDir = newDir;
          currSpot = newSpot;
        }
      }
    } else {
      currDir = turnDirection2DOrthogonal[instruction][currDir];
    }
  });

  return [...currSpot, mapDirectionToNumber(currDir)];
};

const mapDirectionToNumber = (dir: Direction2DOrthogonal) => {
  switch (dir) {
    case RIGHT:
      return 0;
    case DOWN:
      return 1;
    case LEFT:
      return 2;
    case UP:
      return 3;
  }
};

const func = (input: string[], wrappingFunction: WrappingFunction) => {
  const { map, instructions } = parseInput(input);

  const destination = traverse(map, instructions, wrappingFunction);

  return (
    (destination[Y] + 1) * 1000 + (destination[X] + 1) * 4 + destination[2]
  );
};

console.log(1, func(input, wrapAround));
console.log(2, func(input, wrapAroundCube));
