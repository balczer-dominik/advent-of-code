import {
  divideNumbers,
  multiplyNumbers,
  readInputs,
  subtractNumbers,
  sumNumbers,
} from "../helpers";

const [input, testInput] = readInputs(__dirname);

type MonkeyOperator = {
  left: string;
  right: string;
  operation: (left: number, right: number) => number;
};

const mapToOperation = (operator: string) => {
  switch (operator) {
    case "+":
      return sumNumbers;
    case "-":
      return subtractNumbers;
    case "*":
      return multiplyNumbers;
    case "/":
      return divideNumbers;
    default:
      throw new Error("invalid opeartor");
  }
};

const parseInput = (input: string[]) => {
  const toDo: Map<string, MonkeyOperator> = new Map();
  const done: Map<string, number> = new Map();

  input.forEach((row) => {
    const name = row.substring(0, 4);

    const op = row.substring(6);

    if (op.length < 5) {
      done.set(name, parseInt(op));
      return;
    }

    const left = op.substring(0, 4);
    const right = op.substring(7, 11);

    const operation = mapToOperation(op.substring(5, 6));

    toDo.set(name, { left, right, operation });
  });

  return { toDo, done };
};

const calculateRoot = (
  toDo: Map<string, MonkeyOperator>,
  done: Map<string, number>
): number => {
  while (toDo.size > 0) {
    toDo.forEach((monkey, name) => {
      const left = done.get(monkey.left);
      const right = done.get(monkey.right);

      if (left === undefined || right === undefined) {
        return;
      }

      done.set(name, monkey.operation(left, right));
      toDo.delete(name);
    });
  }

  return done.get("root")!;
};

const func1 = (input: string[]) => {
  const { toDo, done } = parseInput(input);

  return calculateRoot(toDo, done);
};

//Binary search
const func2 = (input: string[]) => {
  const { toDo, done } = parseInput(input);

  const rootLeft: string = toDo.get("root")!.left;
  const rootRight: string = toDo.get("root")!.right;

  let lowerBound = 0;
  let upperBound = 99999999999999;
  let curr = Math.floor(upperBound - (upperBound - lowerBound) / 2);

  while (true) {
    console.log(curr);
    const currToDo = new Map(toDo);
    const currDone = new Map(done);
    currDone.set("humn", curr);

    calculateRoot(currToDo, currDone);

    const left = currDone.get(rootLeft)!;
    const right = currDone.get(rootRight)!;

    if (left === right) {
      return curr;
    }

    if (left < right) {
      upperBound = curr;
    } else {
      lowerBound = curr;
    }

    curr = Math.floor(upperBound - (upperBound - lowerBound) / 2);
  }
};

console.log(1, func1(input));
console.log(2, func2(input));
