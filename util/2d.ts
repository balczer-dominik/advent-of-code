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

export const move2D = ([fieldX, fieldY]: Tuple, dir: Direction2D, by: number = 1): Tuple => {
  const [offsetX, offsetY] = offset2D[dir];
  return [fieldX + offsetX * by, fieldY + offsetY * by];
};

export const getNeighbor = <T>(map: Map2D<T>, coords: Tuple, direction: Direction2D) => getField2D(map, move2D(coords, direction));

export const getNeighbors = <T>(map: Map2D<T>, coords: Tuple, orthogonalOnly: boolean = false) =>
  (orthogonalOnly ? directions2DOrthogonal : directions2D)
    .map((direction) => getNeighbor(map, coords, direction))
    .filter((neighbor) => neighbor !== undefined);

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

export const shoelace = (points: Tuple[]) => {
  const sum1 = points.slice(0, -1).sum(([x], i) => x * points[i + 1][Y]);
  const sum2 = points.slice(1).sum(([x], i) => x * points[i][Y]);
  return Math.abs(sum1 + points.last()![X] * points[0][Y] - sum2 - points.last()![Y] * points[0][X]) / 2;
};

export type Map2D<Field> = Map<number, Map<number, Field>>;
