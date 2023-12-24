import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Tuple, Triplet } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = true;
const raw = TEST ? testInput : input;

const hailstones = raw.map((row) => row.split(" @ ").map((s) => s.numberSequence(","))) as Tuple<Triplet>[];

export const func1 = () => {
  const intersections: Tuple[] = [];

  hailstones.slice(0, -1).forEach(([[avx, avy], [ax, ay]], i) =>
    hailstones.slice(i + 1).forEach(([[bvx, bvy], [bx, by]], j) => {
      const [ax2, ay2] = [ax + avx, ay + avy];
      const aA = ay2 - ay;
      const aB = ax - ax2;
      const aC = ay * (ax2 - ax) - (ay2 - ay) * ax;

      const [bx2, by2] = [bx + bvx, by + bvy];
      const bA = by2 - by;
      const bB = bx - bx2;
      const bC = by * (bx2 - bx) - (by2 - by) * bx;

      const ix = (aB * bC - bB * aC) / (aA * bB - bA * aB);
      const iy = (aC * bA - bC * aA) / (aA * bB - bA * aB);

      console.log([i, i + j + 1], ix, iy);

      if (avx < 0 && ix > ax) return;
      if (avx > 0 && ix < ax) return;
      if (avy < 0 && iy > ay) return;
      if (avy > 0 && iy < ay) return;
      if (bvx < 0 && ix > bx) return;
      if (bvx > 0 && ix < bx) return;
      if (bvy < 0 && iy > by) return;
      if (bvy > 0 && iy < by) return;

      intersections.push([i, i + j + 1]);
    })
  );

  return intersections;
};

export const func2 = () => {
  return;
};
