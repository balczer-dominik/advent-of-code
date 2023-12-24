import { readInputs } from "../../util/input";
import "../../util/helpers";
import { Tuple, Triplet } from "../../util/Tuple";
import { init } from "z3-solver";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;
const lowerBound = TEST ? 7 : 200000000000000;
const upperBound = TEST ? 27 : 400000000000000;

const hailstones = raw.map((row) => row.split(" @ ").map((s) => s.numberSequence(","))) as Tuple<Triplet>[];

export const func1 = () =>
  hailstones.slice(0, -1).sum(([[ax, ay], [avx, avy]], i) =>
    hailstones.slice(i + 1).sum(([[bx, by], [bvx, bvy]], j) => {
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

      if (avx < 0 ? ix > ax : ix < ax) return 0;
      if (avy < 0 ? iy > ay : iy < ay) return 0;
      if (bvx < 0 ? ix > bx : ix < bx) return 0;
      if (bvy < 0 ? iy > by : iy < by) return 0;
      if (!ix.isBetween(lowerBound, upperBound)) return 0;
      if (!iy.isBetween(lowerBound, upperBound)) return 0;

      return 1;
    })
  );

export const func2 = async () => {
  const { Context } = await init();
  const { Real, solve, isModel } = Context("main");

  const px = Real.const("px");
  const py = Real.const("py");
  const pz = Real.const("pz");

  const pvx = Real.const("pvx");
  const pvy = Real.const("pvy");
  const pvz = Real.const("pvz");

  const assertions = hailstones.flatMap(([[hx, hy, hz], [hvx, hvy, hvz]], i) => {
    const t = Real.const(`t${i}`);
    return [
      px.add(pvx.mul(t)).eq(t.mul(hvx).add(hx)),
      py.add(pvy.mul(t)).eq(t.mul(hvy).add(hy)),
      pz.add(pvz.mul(t)).eq(t.mul(hvz).add(hz)),
    ];
  });

  const result = await solve(...assertions);
  if (!isModel(result)) return;

  return parseInt(`${result.get(px)}`) + parseInt(`${result.get(py)}`) + parseInt(`${result.get(pz)}`);
};
