import {
  Direction2DOrthogonal,
  directions2DOrthogonal,
  DOWN,
  LEFT,
  move2D,
  RIGHT,
  UP,
} from "../../util/2d";
import { maxReduce, simpleParseInt } from "../../util/helpers";
import { readInputs } from "../../util/input";
import { Tuple, X, Y } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);

type Wind = {
  direction: Direction2DOrthogonal;
  pos: Tuple;
};

const parseInput = (input: string[]): { blizzard: Wind[]; mapSize: Tuple } => {
  const blizzard: Wind[] = [];

  input.forEach((row, y) =>
    row.split("").forEach((field, x) => {
      switch (field) {
        case ">":
          blizzard.push({ direction: RIGHT, pos: [x, y] });
          break;
        case "<":
          blizzard.push({ direction: LEFT, pos: [x, y] });
          break;
        case "^":
          blizzard.push({ direction: UP, pos: [x, y] });
          break;
        case "v":
          blizzard.push({ direction: DOWN, pos: [x, y] });
          break;
        default:
          break;
      }
    })
  );

  const mapSizeX = blizzard.map((b) => b.pos[X]).reduce(maxReduce);
  const mapSizeY = blizzard.map((b) => b.pos[Y]).reduce(maxReduce);

  return { blizzard, mapSize: [mapSizeX, mapSizeY] };
};

const isOutSideMap = ([posX, posY]: Tuple, [mapSizeX, mapSizeY]: Tuple) => {
  if (posX === 1 && posY === 0) {
    return false;
  }

  if (posX === mapSizeX && posY === mapSizeY + 1) {
    return false;
  }

  return !posX.isBetween(0, mapSizeX + 1) || !posY.isBetween(0, mapSizeY + 1);
};

const moveWind = (wind: Wind, [mapSizeX, mapSizeY]: Tuple): Wind => {
  let [newPosX, newPosY] = move2D(wind.pos, wind.direction);

  if (newPosX > mapSizeX) {
    newPosX = 1;
  } else if (newPosX < 1) {
    newPosX = mapSizeX;
  } else if (newPosY > mapSizeY) {
    newPosY = 1;
  } else if (newPosY < 1) {
    newPosY = mapSizeY;
  }

  return { direction: wind.direction, pos: [newPosX, newPosY] };
};

const traverse = (blizzard: Wind[], goals: string[], mapSize: Tuple) => {
  let currReachable: Set<string> = new Set();
  currReachable.add([1, 0].join(","));

  let minute = 0;

  while (!goals.isEmpty()) {
    minute++;
    blizzard = blizzard.map((wind) => moveWind(wind, mapSize));

    const nextReachable: Set<string> = new Set();

    currReachable.forEach((reachable) => {
      const [x, y] = reachable.split(",").map(simpleParseInt);

      (
        [
          [x, y],
          ...directions2DOrthogonal.map((direction) =>
            move2D([x, y], direction)
          ),
        ] as Tuple[]
      ).forEach((newPos) => {
        if (isOutSideMap(newPos, mapSize)) {
          return;
        }
        if (
          blizzard.some(
            (wind) => wind.pos[X] === newPos[X] && wind.pos[Y] === newPos[Y]
          )
        ) {
          return;
        }

        nextReachable.add(newPos.join(","));
      });
    });

    currReachable = nextReachable;

    if (currReachable.has(goals[0])) {
      currReachable = new Set();
      currReachable.add(goals.shift()!);
    }
  }

  return minute;
};

const func1 = (input: string[]) => {
  let { blizzard, mapSize } = parseInput(input);

  const end = [mapSize[X], mapSize[Y] + 1].join(",");
  const goals = [end];

  return traverse(blizzard, goals, mapSize);
};

const func2 = (input: string[]) => {
  let { blizzard, mapSize } = parseInput(input);

  const start = [1, 0].join(",");
  const end = [mapSize[X], mapSize[Y] + 1].join(",");
  const goals = [end, start, end];

  return traverse(blizzard, goals, mapSize);
};

console.log(1, func1(input));
console.log(2, func2(input));
