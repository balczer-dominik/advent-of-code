import { readInputs } from "../../util/input";
import { getIntersection, minReduce, simpleParseInt, sortAscEx } from "../../util/helpers";
import { Tuple } from "../../util/Tuple";

const [input, testInput] = readInputs(__dirname);
const TEST = false;

const parseInput = () => {
  const [seedsRaw, _, ...restRaw] = TEST ? testInput : input;

  const seeds = seedsRaw.split("seeds: ")[1].split(" ").map(simpleParseInt);
  let maps = [];
  let buffer = [];

  for (const row of restRaw) {
    if (row[0]?.isNumber()) {
      const [destinationStart, rangeStart, size] = row.split(" ");
      buffer.push({
        from: parseInt(rangeStart),
        to: parseInt(rangeStart) + parseInt(size) - 1,
        offset: parseInt(destinationStart) - parseInt(rangeStart),
      });
    } else {
      if (buffer.length) maps.push(buffer);
      buffer = [];
    }
  }

  maps.push(buffer);

  return { seeds, maps };
};
const { seeds, maps } = parseInput();

export const func1 = () =>
  seeds
    .map((seed) =>
      maps.reduce(
        (acc, map) =>
          acc + map.filter((mapping) => acc.isBetween(mapping.from - 1, mapping.to + 1))?.map((mapping) => mapping.offset)[0] ?? 0,
        seed
      )
    )
    .reduce(minReduce);

export const func2 = () => {
  const seedRanges = seeds.partition(2).map(([start, size]) => [start, start + size - 1]) as Tuple[];
  return intersectWithMap(seedRanges, maps).flat().reduce(minReduce);
};

const intersectWithMap = (ranges: Tuple[], [currentMap, ...restMaps]: typeof maps): Tuple[] => {
  const newRanges = ranges.flatMap((range) => {
    const intersections = currentMap
      .map(({ from, to, offset }) => ({ range: getIntersection(range, [from, to]), offset }))
      .filter((intersection) => intersection.range !== null)
      .sort(sortAscEx(({ range }) => range![0]));

    let nonIntersectingRanges = [];

    if (intersections.isEmpty()) {
      nonIntersectingRanges = [range];
    } else {
      if (intersections.length >= 2) {
        for (let rangeIndex = 0; rangeIndex < intersections.length - 1; rangeIndex++) {
          const from = intersections[rangeIndex].range![1] + 1;
          const to = intersections[rangeIndex + 1].range![0] - 1;
          if (to < from) continue;
          nonIntersectingRanges.push([from, to]);
        }
      }

      if (intersections[0].range![0] !== range[0])
        nonIntersectingRanges = [[range[0], intersections[0].range![0] - 1], ...nonIntersectingRanges];
      if (intersections.last()!.range![1] !== range[1])
        nonIntersectingRanges = [...nonIntersectingRanges, [intersections.last()!.range![1] + 1, range[1]]];
    }

    return [...nonIntersectingRanges, ...intersections.map(({ range, offset }) => [range![0] + offset, range![1] + offset])] as Tuple[];
  });

  if (restMaps.length) return intersectWithMap(newRanges, restMaps);
  return newRanges;
};
