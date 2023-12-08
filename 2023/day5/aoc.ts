import { readInputs } from "../../util/input";
import { getIntersection, minReduce, simpleParseInt, sortAscEx } from "../../util/helpers";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

type Mapping = {
  from: number;
  to: number;
  offset: number;
};

const [seedsRaw, _, ...restRaw] = TEST ? testInput : input;

const seeds = seedsRaw.split("seeds: ")[1].split(" ").map(simpleParseInt);
const maps = restRaw
  .filter((row) => !row[0] || row[0].isNumber())
  .reduce(
    (maps, row) => {
      if (!row[0]?.isNumber()) return [...maps, []];

      const [destinationStart, rangeStart, size] = row.split(" ");
      maps.last()!.push({
        from: parseInt(rangeStart),
        to: parseInt(rangeStart) + parseInt(size) - 1,
        offset: parseInt(destinationStart) - parseInt(rangeStart),
      });
      return maps;
    },
    [[]] as Mapping[][]
  );

export const func1 = () =>
  seeds.min((seed) =>
    maps.reduce((acc, map) => acc + (map.filter(({ from, to }) => acc.isBetween(from, to, true)).map((map) => map.offset)[0] ?? 0), seed)
  );

export const func2 = () =>
  maps
    .reduce(
      (ranges, map) =>
        ranges.flatMap((range) => {
          const intersections = map
            .map(({ from, to, offset }) => ({ range: getIntersection(range, [from, to])!, offset }))
            .filter(({ range }) => range !== null)
            .sort(sortAscEx(({ range }) => range[0]));

          let nonIntersectingRanges = [];
          if (intersections.isEmpty()) {
            nonIntersectingRanges = [range];
          } else {
            if (intersections.length >= 2)
              for (let rangeIndex = 0; rangeIndex < intersections.length - 1; rangeIndex++) {
                const from = intersections[rangeIndex].range[1] + 1;
                const to = intersections[rangeIndex + 1].range[0] - 1;
                if (to < from) continue;
                nonIntersectingRanges.push([from, to]);
              }

            if (intersections[0].range[0] !== range[0])
              nonIntersectingRanges = [[range[0], intersections[0].range[0] - 1], ...nonIntersectingRanges];
            if (intersections.last()!.range[1] !== range[1])
              nonIntersectingRanges = [...nonIntersectingRanges, [intersections.last()!.range[1] + 1, range[1]]];
          }

          return [...nonIntersectingRanges, ...intersections.map(({ range, offset }) => [range[0] + offset, range[1] + offset])] as Tuple[];
        }),
      seeds.partition(2).map(([start, size]) => [start, start + size - 1]) as Tuple[]
    )
    .flat()
    .min();
