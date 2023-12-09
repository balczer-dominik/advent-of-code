import { readInputs } from "../../util/input";
import { sortDesc, sumNumbers } from "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const valueHistories = raw.map((row) => row.numberSequence());

const predict = (rear: boolean, reducer: (a: number, b: number) => number) =>
  valueHistories.sum((values) => {
    const trail: number[] = [];
    while (values.some((value) => value !== 0)) {
      trail.push(rear ? values.last()! : values[0]);
      values = values.slice(0, -1).map((value, i) => values[i + 1] - value);
    }
    return trail.reduceRight(reducer);
  });

export const func1 = () => predict(true, sumNumbers);
export const func2 = () => predict(false, sortDesc);
