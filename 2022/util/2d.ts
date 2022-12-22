import { Tuple, X, Y } from "./Tuple";

export const RIGHT = "RIGHT";
export const LEFT = "LEFT";
export const UP = "UP";
export const DOWN = "DOWN";

export type Direction2D = Turn2D | typeof DOWN | typeof UP;
export type Turn2D = typeof RIGHT | typeof LEFT;
export type Direction2DShort = "R" | "L" | "U" | "D";

export const offset2D: Record<Direction2D, Tuple> = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  UP: [0, -1],
  DOWN: [0, 1],
};

export const opposite2D: Record<Direction2D, Direction2D> = {
  RIGHT: LEFT,
  LEFT: RIGHT,
  UP: DOWN,
  DOWN: UP,
};

export const parseShortDirection2D: Record<Direction2DShort, Direction2D> = {
  R: RIGHT,
  L: LEFT,
  U: UP,
  D: DOWN,
};

export const getField2D = <T>(map: Map2D<T>, coords: Tuple) =>
  map.get(coords[Y])?.get(coords[X]);

export const turnDirection2D: Record<
  Turn2D,
  Record<Direction2D, Direction2D>
> = {
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
