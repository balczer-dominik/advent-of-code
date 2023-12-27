import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";
import { CircularIterator } from "../../util/CircularIterator";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

export const func1 = () => {
  const rates = _.range(0, raw[0].length).map((idx) => {
    const bits = raw.map((b) => b[idx]);
    return bits.filter((b) => b === "0").length > bits.filter((b) => b === "1").length ? [0, 1] : [1, 0];
  });

  return parseInt(rates.map((r) => r[0]).join(""), 2) * parseInt(rates.map((r) => r[1]).join(""), 2);
};

const getValue = (majority: boolean) => {
  let iterator = new CircularIterator(..._.range(0, raw[0].length));
  let data = [...raw];

  for (let idx = iterator.next(); data.length !== 1; idx = iterator.next()) {
    const bits = data.map((b) => b[idx]);
    const winner = (
      majority
        ? bits.filter((b) => b === "0").length > bits.filter((b) => b === "1").length
        : bits.filter((b) => b === "0").length <= bits.filter((b) => b === "1").length
    )
      ? "0"
      : "1";
    data = data.filter((number) => number[idx] === winner);
  }
  return parseInt(data[0], 2);
};

export const func2 = () => getValue(true) * getValue(false);
