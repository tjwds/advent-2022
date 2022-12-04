const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = (input) => {
  return input.reduce((score, line) => {
    const [first, second] = line.split(",");
    const [firstStart, firstEnd] = first.split("-").map(Number);
    const [secondStart, secondEnd] = second.split("-").map(Number);
    if (firstStart <= secondStart) {
      if (secondEnd <= firstEnd) {
        return (score += 1);
      }
    }
    if (firstStart >= secondStart) {
      if (secondEnd >= firstEnd) {
        return (score += 1);
      }
    }

    return score;
  }, 0);
};

// yeah I know this copies a lot of code from part one
const partTwo = (input) => {
  return input.reduce((score, line) => {
    const [first, second] = line.split(",");
    const [firstStart, firstEnd] = first.split("-").map(Number);
    const [secondStart, secondEnd] = second.split("-").map(Number);
    if (firstEnd < secondStart || secondEnd < firstStart) {
      return score;
    }

    return (score += 1);
  }, 0);
};

console.log(partOne(input), partTwo(input));
