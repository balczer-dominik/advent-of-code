import { readInputs } from "../../util/input";
import "../../util/helpers";
import _ from "lodash";

const [input, testInput] = readInputs(__dirname);
const TEST = false;
const raw = TEST ? testInput : input;

const defaultState: Record<number, number[]> = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
};

const [drawnRaw, ...boardsRaw] = raw.filter((r) => r[0] !== undefined);
const drawn = drawnRaw.numberSequence(",");
const boards = boardsRaw
  .map((r) => r.numberSequence())
  .partition(5)
  .map((board) => ({ numbers: board, drawnRow: _.cloneDeep(defaultState), drawnColumn: _.cloneDeep(defaultState) }));
type Board = (typeof boards)[number];

const isWinner = (drawn: number, board: Board) => {
  board.numbers.forEach((row, y) =>
    row.forEach((n, x) => {
      if (drawn === n) {
        board.drawnColumn[x].push(drawn);
        board.drawnRow[y].push(drawn);
      }
    })
  );

  return (
    [
      ...Object.values(board.drawnColumn)
        .filter((c) => c.length === 5)
        .flat(),
      ...Object.values(board.drawnRow)
        .filter((c) => c.length === 5)
        .flat(),
    ].length > 0
  );
};

export const func1 = () => {
  for (const drawId of _.range(0, drawn.length)) {
    const currDraw = drawn[drawId];

    for (const board of boards) {
      if (isWinner(currDraw, board))
        return (
          board.numbers
            .flat()
            .filter((n) => !drawn.slice(0, drawId + 1).includes(n))
            .sum() * currDraw
        );
    }
  }
};

export const func2 = () => {
  let currBoards = [...boards];
  for (const drawId of _.range(0, drawn.length)) {
    const currDraw = drawn[drawId];
    const nextBoards = [];

    for (let board of currBoards) {
      const won = isWinner(currDraw, board);

      if (!won) nextBoards.push(board);
      if (won && currBoards.length === 1) {
        return (
          board.numbers
            .flat()
            .filter((n) => !drawn.slice(0, drawId + 1).includes(n))
            .sum() * currDraw
        );
      }
    }

    currBoards = nextBoards;
  }
};
