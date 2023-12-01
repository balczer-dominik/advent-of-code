import { Triplet, Tuple, X, Y } from "./Tuple";

export const RIGHT = "RIGHT";
export const LEFT = "LEFT";
export const UP = "UP";
export const DOWN = "DOWN";
export const UPPER_LEFT = "UPPER_LEFT";
export const UPPER_RIGHT = "UPPER_RIGHT";
export const LOWER_LEFT = "LOWER_LEFT";
export const LOWER_RIGHT = "LOWER_RIGHT";

export const directions2DOrthogonal = [RIGHT, DOWN, UP, LEFT] as const;
export const directions2DDiagonal = [UPPER_LEFT, UPPER_RIGHT, LOWER_LEFT, LOWER_RIGHT] as const;
export const directions2D = [...directions2DDiagonal, ...directions2DOrthogonal];

export type Direction2DOrthogonal = (typeof directions2DOrthogonal)[number];
export type Direction2DDiagonal = (typeof directions2DDiagonal)[number];
export type Direction2D = Direction2DDiagonal | Direction2DOrthogonal;
export type Turn2D = typeof RIGHT | typeof LEFT;
export type Direction2DShort = "R" | "L" | "U" | "D";

export const offset2D: Record<Direction2D, Tuple> = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  UP: [0, -1],
  DOWN: [0, 1],
  UPPER_LEFT: [-1, -1],
  UPPER_RIGHT: [1, -1],
  LOWER_LEFT: [-1, 1],
  LOWER_RIGHT: [1, 1],
};

export const opposite2D: Record<Direction2D, Direction2D> = {
  RIGHT: LEFT,
  LEFT: RIGHT,
  UP: DOWN,
  DOWN: UP,
  UPPER_LEFT: LOWER_RIGHT,
  UPPER_RIGHT: LOWER_LEFT,
  LOWER_LEFT: UPPER_RIGHT,
  LOWER_RIGHT: UPPER_LEFT,
};

export const parseShortDirection2D: Record<Direction2DShort, Direction2DOrthogonal> = {
  R: RIGHT,
  L: LEFT,
  U: UP,
  D: DOWN,
};

export const getField2D = <T>(map: Map2D<T>, coords: Tuple) => map.get(coords[Y])?.get(coords[X]);

export const move2D = ([fieldX, fieldY]: Tuple, dir: Direction2D): Tuple => {
  const [offsetX, offsetY] = offset2D[dir];
  return [fieldX + offsetX, fieldY + offsetY];
};

export const turnDirection2DOrthogonal: Record<Turn2D, Record<Direction2DOrthogonal, Direction2DOrthogonal>> = {
  RIGHT: {
    UP: RIGHT,
    RIGHT: DOWN,
    DOWN: LEFT,
    LEFT: UP,
  },
  LEFT: {
    UP: LEFT,
    LEFT: DOWN,
    DOWN: RIGHT,
    RIGHT: UP,
  },
};

export type Map2D<Field> = Map<number, Map<number, Field>>;
