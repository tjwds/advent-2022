const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

// flags for parser mode
const STACKS = 0;
const MOVES = 1;

const capitalLetterRegex = /[A-Z]/;

const parseInput = function (input) {
  const stacks = {};
  const moves = [];

  let mode = STACKS;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];

    if (mode === STACKS) {
      if (line.length === 0) {
        mode = MOVES;
        continue;
      }

      for (let j = 1, k = 1; j < line.length; j += 4, k += 1) {
        let char = line[j];
        if (char) {
          let stack = stacks[k];
          if (!stack) {
            stack = stacks[k] = [];
          }
          if (capitalLetterRegex.test(char)) {
            stack.unshift(char);
          }
        }
      }
    } else {
      moves.push(line);
    }
  }
  return { stacks, moves };
};

const moveLineRegex = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

const partOne = function (input) {
  const { stacks, moves } = parseInput(input);

  moves.forEach((move) => {
    const [, number, start, end] = move.match(moveLineRegex);
    for (let i = 0; i < number; i++) {
      stacks[end].push(stacks[start].pop());
    }
  });

  // XXX this isn't guaranteed to be sorted 😬
  return Object.values(stacks).reduce(
    (string, stack) => string + stack.at(-1),
    ""
  );
};

const partTwo = function (input) {
  const { stacks, moves } = parseInput(input);

  moves.forEach((move) => {
    const [, n, start, end] = move.match(moveLineRegex);
    const number = Number(n);

    const startStack = stacks[start];
    const index = startStack.length - number;

    const moved = startStack.slice(index);
    stacks[start] = startStack.slice(0, index);
    stacks[end].push(...moved);
  });

  // XXX this isn't guaranteed to be sorted 😬
  return Object.values(stacks).reduce(
    (string, stack) => string + stack.at(-1),
    ""
  );
};

console.log(partTwo(input));
