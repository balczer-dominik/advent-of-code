import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const parsed = raw[0].split(",");

export const func1 = () => {
  return parsed.sum((string) =>
    string.split("").reduce((acc, curr) => {
      const ascii = curr.charCodeAt(0);
      console.log(((acc + ascii) * 17) % 256);
      return ((acc + ascii) * 17) % 256;
    }, 0)
  );
};

export const func2 = () => {
  const boxes = new Map<number, Tuple<string, number>[]>();

  parsed.forEach((string) => {
    if (string.includes("-")) {
      const [lensToRemove] = string.split("-");
      const boxIdx = lensToRemove.split("").reduce((acc, curr) => {
        const ascii = curr.charCodeAt(0);
        console.log(((acc + ascii) * 17) % 256);
        return ((acc + ascii) * 17) % 256;
      }, 0);
      const box = boxes.get(boxIdx);
      if (box) {
        boxes.set(
          boxIdx,
          box.filter(([lens]) => lens !== lensToRemove)
        );
      }
    } else {
      const [lens, focalLength] = string.split("=");
      const boxIdx = lens.split("").reduce((acc, curr) => {
        const ascii = curr.charCodeAt(0);
        console.log(((acc + ascii) * 17) % 256);
        return ((acc + ascii) * 17) % 256;
      }, 0);
      const box = boxes.get(boxIdx);
      if (!box || !box.find(([l]) => l === lens)) {
        boxes.set(boxIdx, [...(box ?? []), [lens, parseInt(focalLength)]]);
      } else {
        boxes.set(
          boxIdx,
          box.map(([l, fl]) => (l === lens ? [lens, parseInt(focalLength)] : [l, fl]))
        );
      }
    }
  });

  return [...boxes.entries()].sum(([boxIdx, content]) =>
    content.sum(([lens, focalLength], lensIdx) => (1 + boxIdx) * (1 + lensIdx) * focalLength)
  );
};
