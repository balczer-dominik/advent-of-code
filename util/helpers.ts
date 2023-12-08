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
    isBetween: (lowerBound: number, upperBound: number, inclusive?: boolean) => boolean;
    gcd: (otherNumber: number) => number;
    lcm: (otherNumber: number) => number;
  }
  interface Array<T> {
    last: () => T | undefined;
    isEmpty: () => boolean;
    partition: (groupLength: number) => Array<Array<T>>;
    sum: (mapper?: (el: T) => number) => number;
    product: (mapper?: (el: T) => number) => number;
    lcm: (mapper?: (el: T) => number) => number;
    gcd: (mapper?: (el: T) => number) => number;
    min: (mapper?: (el: T) => number) => number;
    max: (mapper?: (el: T) => number) => number;
  }
  interface String {
    isNumber: () => boolean;
    toNumber: () => number;
  }
}

Number.prototype.isBetween = function (lowerBound: number, upperBound: number, inclusive: boolean = false): boolean {
  return this.valueOf() > lowerBound + (inclusive ? -1 : 0) && this.valueOf() < upperBound + (inclusive ? +1 : 0);
};
Number.prototype.gcd = function (otherNumber: number) {
  let result = this.valueOf();
  for (let temp = otherNumber; otherNumber !== 0; ) {
    otherNumber = result % otherNumber;
    result = temp;
    temp = otherNumber;
  }
  return result;
};
Number.prototype.lcm = function (otherNumber: number) {
  return (this.valueOf() * otherNumber) / this.gcd(otherNumber);
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
Array.prototype.sum = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, num) => mapper(num) + acc, 0);
};
Array.prototype.product = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, num) => mapper(num) * acc, 1);
};
Array.prototype.lcm = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, num) => mapper(num).lcm(acc), 1);
};
Array.prototype.gcd = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, num) => mapper(num).gcd(acc), 1);
};
Array.prototype.min = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, curr) => {
    const value = mapper(curr);
    return value < acc ? value : acc;
  }, mapper(this[0]));
};
Array.prototype.max = function <T>(mapper: (el: T) => number = (el) => el as number) {
  return this.reduce((acc, curr) => {
    const value = mapper(curr);
    return value > acc ? value : acc;
  }, mapper(this[0]));
};

String.prototype.isNumber = function (): boolean {
  return !isNaN(parseInt(this.toString()));
};
String.prototype.toNumber = function () {
  return parseInt(this.valueOf());
};

export const simpleParseInt = (number: string) => parseInt(number);
