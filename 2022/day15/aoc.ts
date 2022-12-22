import { readFileSync } from "fs";
const input = readFileSync("input.txt").toString().split("\n");
const testInput = readFileSync("test_input.txt").toString().split("\n");
type Coord = { x: number; y: number };
const func = (input: string[]) => {
  const source = { x: 500, y: 0 };
  const parsed = input.map((row) =>
    row
      .split("->")
      .map((coord) =>
        coord
          .trim()
          .split("")
          .filter((t) => t !== "\r")
          .join("")
          .split(",")
          .map((t) => parseInt(t))
      )
      .map((t) => ({ x: t[0], y: t[1] }))
  );
  const walls = constructWalls(parsed);
  const sand: Coord[] = [];
  const floorLevel = walls.sort((a, b) => b.y - a.y)[0].y + 2;
  const dropSand = (to: Coord): void => {
    const blocked = [...walls, ...sand];
    let down = {
      ...(blocked
        .filter((o) => o.x === to.x && o.y > to.y)
        .sort((a, b) => a.y - b.y)[0] ?? { x: to.x, y: floorLevel }),
    };
    down = { ...down, y: down.y - 1 };
    if (down.y == floorLevel - 1) {
      sand.push(down);
      return;
    }
    const hasBelowLeft = blocked.some(
      (b) => b.x === down.x - 1 && b.y === down.y + 1
    );
    if (!hasBelowLeft) {
      dropSand({ x: down.x - 1, y: down.y + 1 });
      return;
    }
    const hasBelowRight = blocked.some(
      (b) => b.x === down.x + 1 && b.y === down.y + 1
    );
    if (!hasBelowRight) {
      dropSand({ x: down.x + 1, y: down.y + 1 });
      return;
    }
    sand.push(down);
  };

  let canDropMore = true;
  while (canDropMore) {
    dropSand(source);
    if (sand.length % 1000 === 0) {
      console.log(sand.length);
      for (let y = 0; y < 200; y++) {
        let row: string[] = [];
        for (let x = 480; x < 600; x++) {
          const hasWall = walls.some((w) => w.x === x && w.y === y);
          const hasSand = sand.some((w) => w.x === x && w.y === y);
          row.push(hasWall ? "#" : hasSand ? "o" : ".");
        }
        console.log(row.join(""));
      }
    }

    canDropMore = !sand.some((s) => s.x === source.x && s.y === source.y);
  }

  for (let y = 0; y < 200; y++) {
    let row: string[] = [];
    for (let x = 480; x < 600; x++) {
      const hasWall = walls.some((w) => w.x === x && w.y === y);
      const hasSand = sand.some((w) => w.x === x && w.y === y);
      row.push(hasWall ? "#" : hasSand ? "o" : ".");
    }
    console.log(row.join(""));
  }
  return sand.length;
};

console.log(func(input));

function constructWalls(parsed: Coord[][]) {
  return parsed
    .flatMap((struct) =>
      struct.flatMap((corner, index) => {
        const blocked: Coord[] = [corner];
        if (index === struct.length - 1) {
          return blocked;
        }
        const next = struct[index + 1];
        const xDist = Math.abs(next.x - corner.x);
        const yDist = Math.abs(next.y - corner.y);
        const xInc = xDist === 0 ? 0 : (next.x - corner.x) / xDist;
        const yInc = yDist === 0 ? 0 : (next.y - corner.y) / yDist;
        const iterator = { ...corner };
        while (JSON.stringify(iterator) !== JSON.stringify(next)) {
          iterator.x += xInc;
          iterator.y += yInc;
          blocked.push({ ...iterator });
        }
        return blocked;
      })
    )
    .filter(onlyUnique);
}
function onlyUnique(value: Coord, index: number, self: Coord[]) {
  return (
    self.indexOf(self.find((s) => s.x === value.x && s.y === value.y)!) ===
    index
  );
}
