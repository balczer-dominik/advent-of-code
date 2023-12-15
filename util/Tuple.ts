export const X = 0;
export const Y = 1;
export const Z = 2;
export const A = 3;

export type Tuple<T = number, E = T> = [x: T, y: E];
export type Triplet<T = number> = [x: T, y: T, z: T];
export type Quartet<T = number> = [x: T, y: T, z: T, a: T];
