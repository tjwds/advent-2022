const TEST = false;

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, TEST ? "/test.txt" : "/input.txt"))
  .toString()
  .split("\n");

const charToMultiplier = {
  2: 2,
  1: 1,
  0: 0,
  "-": -1,
  "=": -2,
};

const multiplierToChar = {
  2: 2,
  1: 1,
  0: 0,
  "-1": "-",
  "-2": "=",
};

const lastNumToResult = {
  9: 1,
  8: 2,
  7: -2,
  6: -1,
  5: 0,
  4: 1,
  3: 2,
  2: -2,
  1: -1,
  0: 0,
};

const partOne = () => {
  let total = 0;

  input.forEach((number) => {
    number
      .split("")
      .reverse()
      .forEach((char, i) => {
        total += charToMultiplier[char] * 5 ** i;
      });
  });

  let result = "";

  while (total !== 0) {
    const lastNum = total % 10;
    const modifier = lastNumToResult[lastNum];

    result = multiplierToChar[lastNumToResult[lastNum] * -1] + result;

    total = (total + modifier) / 5;
  }

  return result;
};

console.log(partOne());
