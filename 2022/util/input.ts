import { readFileSync } from "fs";

export const readInputs = (dirName: string): [string[], string[]] => {
  const testInput = readFileSync(`${dirName}/test_input.txt`)
    .toString()
    .split("\n")
    .map((row) =>
      row
        .split("")
        .filter((c) => c != "\r")
        .join("")
    );

  const input = readFileSync(`${dirName}/input.txt`)
    .toString()
    .split("\n")
    .map((row) =>
      row
        .split("")
        .filter((c) => c != "\r")
        .join("")
    );

  return [input, testInput];
};
