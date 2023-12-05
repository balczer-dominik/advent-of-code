import _ from "lodash";

export type ObjectValues<T> = T[keyof T];

export const reverseKeyValues = (obj: object) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export const uniqueFilter = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index;
};

export const uniqueByFilter =
  <T, E>(keyExtractor: (obj: T) => E) =>
  (value: T, index: number, self: T[]) =>
    self.findIndex((s) => keyExtractor(s) === keyExtractor(value))! === index;

export const rangesIntersect = ([fromA, toA]: [number, number], [fromB, toB]: [number, number]) => !(toA < fromB || fromA > toB);

export const getIntersection = ([fromA, toA]: [number, number], [fromB, toB]: [number, number]) => {
  const fromResult = Math.max(fromA, fromB);
  const toResult = Math.min(toA, toB);
  return fromResult > toResult ? null : [fromResult, toResult];
};

export const bfs = <Field>(from: Field, to: Field, neighborExtractor: (field: Field) => Field[]) => {
  const queue: Field[][] = [];
  const visited: Field[] = [from];
  let curr: Field[] = [from];

  while (curr.last() !== to) {
    if (!queue.isEmpty()) {
      curr = queue.shift()!;
    }

    const head = curr.last()!;

    neighborExtractor(head).forEach((neighbor) => {
      if (!visited.some((n) => _.isEqual(n, neighbor))) {
        visited.push(neighbor);
        queue.push([...curr, neighbor]);
      }
    });
  }

  return curr.filter((_, i) => i !== 0);
};

export const sortAsc = (a: number, b: number) => {
  return a - b;
};

export const sortAscEx =
  <T>(extractor: (item: T) => number) =>
  (a: T, b: T) =>
    extractor(a) - extractor(b);

export const sortDesc = (a: number, b: number) => {
  return b - a;
};

export const sortDescEx =
  <T>(extractor: (item: T) => number) =>
  (a: T, b: T) =>
    extractor(b) - extractor(a);

export const sumNumbers = (a: number, b: number) => a + b;
export const subtractNumbers = (a: number, b: number) => a - b;
export const multiplyNumbers = (a: number, b: number) => a * b;
export const divideNumbers = (a: number, b: number) => a / b;
export const maxReduce = (acc: number, curr: number) => (acc > curr ? acc : curr);
export const minReduce = (acc: number, curr: number) => (acc < curr ? acc : curr);

declare global {
  interface Number {
    isBetween: (lowerBound: number, upperBound: number) => boolean;
  }
  interface Array<T> {
    last: () => T | undefined;
    isEmpty: () => boolean;
    partition: (groupLength: number) => Array<Array<T>>;
  }
  interface String {
    isNumber: () => boolean;
  }
}
Number.prototype.isBetween = function (lowerBound: number, upperBound: number): boolean {
  return this > lowerBound && this < upperBound;
};
Array.prototype.last = function <T>(): T | undefined {
  return this[this.length - 1];
};
Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};
Array.prototype.partition = function (groupLength: number) {
  return this.length ? [this.splice(0, groupLength)].concat(this.partition(groupLength)) : [];
};
String.prototype.isNumber = function (): boolean {
  return !isNaN(parseInt(this.toString()));
};

export const simpleParseInt = (number: string) => parseInt(number);
