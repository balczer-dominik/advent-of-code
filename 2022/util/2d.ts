import { Tuple } from "./helpers";

export const X = 0;
export const Y = 1;

export const RIGHT = "R";
export const LEFT = "L";
export const UP = "U";
export const DOWN = "D";

export type Direction2D = typeof RIGHT | typeof LEFT | typeof DOWN | typeof UP;
export type Turn2D = typeof RIGHT | typeof LEFT;

export const offset2D: Record<Direction2D, Tuple> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

export const oppositeOffset2D: Record<Direction2D, Tuple> = {
  R: [-1, 0],
  L: [1, 0],
  U: [0, 1],
  D: [0, -1],
};

export const getField2D = <T>(map: Map2D<T>, coords: Tuple) =>
  map.get(coords[Y])?.get(coords[X]);

export const turnDirection2D: Record<
  Turn2D,
  Record<Direction2D, Direction2D>
> = {
  R: {
    U: RIGHT,
    R: DOWN,
    D: LEFT,
    L: UP,
  },
  L: {
    U: LEFT,
    L: DOWN,
    D: RIGHT,
    R: UP,
  },
};

export type Map2D<Field> = Map<number, Map<number, Field>>;
