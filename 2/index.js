const codeToOutcomeScore = {
  "A X": 3,
  "A Y": 6,
  "A Z": 0,
  "B X": 0,
  "B Y": 3,
  "B Z": 6,
  "C Y": 0,
  "C Z": 3,
  "C X": 6,
};

const codeToShapeScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

const codeToResultScore = {
  X: 0,
  Y: 3,
  Z: 6,
};

const outcomeCodeToShapeScore = {
  "A X": 3,
  "A Y": 1,
  "A Z": 2,

  "B X": 1,
  "B Y": 2,
  "B Z": 3,

  "C X": 2,
  "C Y": 3,
  "C Z": 1,
};

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = (input) =>
  input.reduce(
    (before, code) =>
      before + codeToOutcomeScore[code] + codeToShapeScore[code.at(-1)],
    0
  );

const partTwo = (input) =>
  input.reduce(
    (before, code) =>
      before + outcomeCodeToShapeScore[code] + codeToResultScore[code.at(-1)],
    0
  );

console.log(partTwo(input));
