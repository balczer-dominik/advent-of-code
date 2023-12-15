import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const parsed = raw[0].split(",");

const hashString = (string: string) => string.split("").reduce((acc, curr) => ((acc + curr.charCodeAt(0)) * 17) % 256, 0);

export const func1 = () => parsed.sum(hashString);

export const func2 = () => {
  const boxes = new Map<number, Tuple<string>[]>();

  parsed.forEach((string) => {
    const [newLens, newFocalLength] = string.split(/[-=]/);
    const boxIdx = hashString(newLens);
    const lenses = boxes.get(boxIdx) ?? [];
    const newLenses = string.includes("-")
      ? lenses.filter(([lens]) => lens !== newLens)
      : !lenses.find(([lens]) => lens === newLens)
      ? [...lenses, [newLens, newFocalLength]]
      : lenses.map(([lens, focalLength]) => (lens === newLens ? [newLens, newFocalLength] : [lens, focalLength]));
    boxes.set(boxIdx, newLenses as Tuple<string>[]);
  });

  return [...boxes.entries()].sum(([boxIdx, lenses]) =>
    lenses.sum(([_, focalLength], lensIdx) => (1 + boxIdx) * (1 + lensIdx) * parseInt(focalLength))
  );
};
