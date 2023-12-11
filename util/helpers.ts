import _ from "lodash";

// ------------STRING------------

export const simpleParseInt = (number: string) => parseInt(number);

declare global {
  interface String {
    isNumber: () => boolean;
    toNumber: () => number;
    numberSequence: (separator?: string) => number[];
  }
}

String.prototype.isNumber = function () {
  return !isNaN(parseInt(this.toString()));
};
String.prototype.toNumber = function () {
  return parseInt(this.valueOf());
};
String.prototype.numberSequence = function (separator: string = " ") {
  return this.split(separator)
    .filter((s) => s !== "" && s.isNumber())
    .map(simpleParseInt);
};

// ------------NUMBER------------

export const sumNumbers = (a: number, b: number) => a + b;
export const subtractNumbers = (a: number, b: number) => a - b;
export const multiplyNumbers = (a: number, b: number) => a * b;
export const divideNumbers = (a: number, b: number) => a / b;

declare global {
  interface Number {
    isBetween: (lowerBound: number, upperBound: number, inclusive?: boolean) => boolean;
    gcd: (otherNumber: number) => number;
    lcm: (otherNumber: number) => number;
  }
}

Number.prototype.isBetween = function (a: number, b: number, inclusive: boolean = false): boolean {
  return this.valueOf() > (a > b ? b : a) + (inclusive ? -1 : 0) && this.valueOf() < (a < b ? b : a) + (inclusive ? +1 : 0);
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

// ------------OBJECT------------

export type ObjectValues<T> = T[keyof T];
export const reverseKeyValues = (obj: object) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

// ------------ARRAY------------

export const uniqueFilter = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;
export const uniqueByFilter =
  <T, E>(keyExtractor: (obj: T) => E) =>
  (value: T, index: number, self: T[]) =>
    self.findIndex((s) => keyExtractor(s) === keyExtractor(value))! === index;

export const sortAsc = (a: number, b: number) => a - b;
export const sortDesc = (a: number, b: number) => b - a;
export const sortAscEx =
  <T>(extractor: (item: T) => number) =>
  (a: T, b: T) =>
    extractor(a) - extractor(b);
export const sortDescEx =
  <T>(extractor: (item: T) => number) =>
  (a: T, b: T) =>
    extractor(b) - extractor(a);

declare global {
  interface Array<T> {
    last: () => T | undefined;
    isEmpty: () => boolean;
    partition: (groupLength: number) => Array<Array<T>>;
    sum: (mapper?: (el: T, idx: number) => number) => number;
    product: (mapper?: (el: T, idx: number) => number) => number;
    lcm: (mapper?: (el: T, idx: number) => number) => number;
    gcd: (mapper?: (el: T, idx: number) => number) => number;
    min: (mapper?: (el: T, idx: number) => number) => number;
    max: (mapper?: (el: T, idx: number) => number) => number;
    distinct: (mapper?: (el: T) => any) => Array<T>;
    toObject: <U>(keyMapper: (el: T, idx: number) => string | number, valueMapper: (el: T, idx: number) => U) => { [key: string]: U };
  }
}

Array.prototype.last = function <T>(): T | undefined {
  return this[this.length - 1];
};
Array.prototype.isEmpty = function () {
  return this.length === 0;
};
Array.prototype.partition = function (groupLength: number) {
  return this.length ? [this.splice(0, groupLength)].concat(this.partition(groupLength)) : [];
};
Array.prototype.sum = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  return this.map(mapper).reduce(sumNumbers, 0);
};
Array.prototype.product = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  return this.map(mapper).reduce(multiplyNumbers, 1);
};
Array.prototype.lcm = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  return this.map(mapper).reduce((acc, num) => num.lcm(acc), 1);
};
Array.prototype.gcd = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  return this.map(mapper).reduce((acc, num) => num.gcd(acc), 1);
};
Array.prototype.min = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  const mapped = this.map(mapper);
  return mapped.reduce((acc: number, curr: number) => (acc < curr ? acc : curr), mapped[0]);
};
Array.prototype.max = function <T>(mapper: (el: T, idx: number) => number = (el) => el as number) {
  const mapped = this.map(mapper);
  return mapped.reduce((acc: number, curr: number) => (acc > curr ? acc : curr), mapped[0]);
};
Array.prototype.distinct = function <T>(mapper: (el: T) => any = (el) => el) {
  return this.filter(uniqueByFilter(mapper));
};
Array.prototype.toObject = function <T, U>(keyMapper: (el: T, idx: number) => string | number, valueMapper: (el: T, idx: number) => U) {
  const keys = this.map(keyMapper);
  const values = this.map(valueMapper);
  return this.reduce((obj, _, i) => ({ ...obj, [keys[i]]: values[i] }), {});
};

// ------------TUPLE------------

export const rangesIntersect = ([fromA, toA]: [number, number], [fromB, toB]: [number, number]) => !(toA < fromB || fromA > toB);
export const getIntersection = ([fromA, toA]: [number, number], [fromB, toB]: [number, number]) => {
  const fromResult = Math.max(fromA, fromB);
  const toResult = Math.min(toA, toB);
  return fromResult > toResult ? null : [fromResult, toResult];
};

// ------------GRAPH------------

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

  return curr.slice(1);
};
