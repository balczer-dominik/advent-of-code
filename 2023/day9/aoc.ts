import { readInputs } from "../../util/input";
import { sortDesc, sumNumbers } from "../../util/helpers";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const raw = TEST ? testInput : input;

const valueHistories = raw.map((row) => row.numberSequence());

const predict = (trailExtractor: (seq: number[]) => number, reducer: (a: number, b: number) => number) =>
  valueHistories.sum((values) => {
    const trail: number[] = [];
    while (values.some((value) => value !== 0)) {
      trail.push(trailExtractor(values));
      values = values.slice(0, -1).map((value, i) => values[i + 1] - value);
    }
    return trail.reduceRight(reducer);
  });

export const func1 = () => predict((seq) => seq.last()!, sumNumbers);
export const func2 = () => predict((seq) => seq[0], sortDesc);
