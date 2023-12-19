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

export const func2 = () => {
  let iterator = new CircularIterator(..._.range(0, raw[0].length));
  let idx = iterator.next();
  let data = [...raw];
  let oxygen;
  let co2;
  while (true) {
    const bits = data.map((b) => b[idx]);
    const majority = bits.filter((b) => b === "0").length > bits.filter((b) => b === "1").length ? "0" : "1";
    data = data.filter((number) => number[idx] === majority);
    idx = iterator.next();
    if (data.length === 1) {
      oxygen = parseInt(data[0], 2);
      break;
    }
  }
  iterator = new CircularIterator(..._.range(0, raw[0].length));
  idx = iterator.next();
  data = [...raw];
  while (true) {
    const bits = data.map((b) => b[idx]);
    const minority = bits.filter((b) => b === "0").length <= bits.filter((b) => b === "1").length ? "0" : "1";
    data = data.filter((number) => number[idx] === minority);
    idx = iterator.next();
    if (data.length === 1) {
      co2 = parseInt(data[0], 2);
      break;
    }
  }

  return oxygen * co2;
};
