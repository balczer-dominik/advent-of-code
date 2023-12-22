import { readInputs } from "../../util/input";
import "../../util/helpers";
import { directions2DOrthogonal, move2D } from "../../util/2d";
import { Tuple } from "../../util/Tuple";
import _ from "lodash";

const [input] = readInputs(__dirname);
const mapWidth = input[0].length;
const mapHeight = input.length;

const fields = input.flatMap((row, y) => row.split("").flatMap((c, x) => (c === "." || c === "S" ? [`${x}=${y}`] : [])));
const start = input.flatMap((row, y) => row.split("").flatMap((c, x) => (c === "S" ? [`${x}=${y}`] : [])))[0];

export const func1 = () => getCanReachFor(64)["0=0"];

const getCanReachFor = (maxSteps: number) => {
  const even = maxSteps % 2 === 0;
  const canReach = new Set<string>();
  if (even) canReach.add(start);

  let lastVisited = new Set<string>().add(start);

  for (let steps = 0; steps < maxSteps; steps++) {
    const toVisit = new Set<string>();
    [...lastVisited]
      .flatMap((node) => directions2DOrthogonal.map((direction) => move2D(node.numberSequence("=") as Tuple, direction)))
      .forEach(([x, y]) => {
        const stringified = `${x}=${y}`;
        if (canReach.has(stringified) || toVisit.has(stringified)) return;
        const [xN, yN] = [x % mapWidth, y % mapHeight];
        if (!fields.includes(`${xN < 0 ? xN + mapWidth : xN}=${yN < 0 ? yN + mapHeight : yN}`)) return;

        if (steps % 2 === (even ? 1 : 0)) canReach.add(stringified);
        toVisit.add(stringified);
      });

    lastVisited = toVisit;
  }

  return [...canReach.values()].reduce((acc: { [key: string]: number }, node) => {
    const [x, y] = node.numberSequence("=");

    const xN = Math.floor(x / mapWidth);
    const yN = Math.floor(y / mapHeight);
    const quadrant = `${xN}=${yN}`;

    return { ...acc, [quadrant]: (acc[quadrant] ?? 0) + 1 };
  }, {});
};

export const func2 = () => {
  const radius = (26501365 - 65) / 131;
  const quadrants = getCanReachFor(2 * 131 + 65);

  const tlOuterBorder = quadrants["-1=-2"];
  const tlInnerBorder = quadrants["-1=-1"];
  const blOuterBorder = quadrants["-1=2"];
  const blInnerBorder = quadrants["-1=1"];
  const brOuterBorder = quadrants["1=2"];
  const brInnerBorder = quadrants["1=1"];
  const trOuterBorder = quadrants["2=-1"];
  const trInnerBorder = quadrants["1=-1"];
  const inner = [tlInnerBorder, blInnerBorder, brInnerBorder, trInnerBorder].sum((inner) => inner * (radius - 1));
  const outer = [tlOuterBorder, blOuterBorder, brOuterBorder, trOuterBorder].sum((outer) => outer * radius);

  const posX = quadrants["2=0"];
  const negX = quadrants["-2=0"];
  const posY = quadrants["0=2"];
  const negY = quadrants["0=-2"];
  const axes = posX + negX + posY + negY;

  const odd = quadrants["0=0"];
  const even = quadrants["1=0"];
  const oddSum = odd * (_.range(1, radius / 2 + 1).sum((x) => 2 * (x - 1)) * 4 + 1);
  const evenSum = even * (radius / 2) ** 2 * 4;

  return axes + inner + outer + oddSum + evenSum;
};
