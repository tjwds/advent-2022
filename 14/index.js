const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const run = (part = 1) => {
  const map = {};
  let maxY = 0;

  input.forEach((rockLine) => {
    const rockCoordinates = rockLine
      .split(" -> ")
      .map((items) => items.split(",").map(Number));

    for (let i = 1; i < rockCoordinates.length; i++) {
      const start = [...rockCoordinates[i - 1]];
      const end = rockCoordinates[i];

      if (start[1] > maxY) {
        maxY = start[1];
      }
      if (end[1] > maxY) {
        maxY = end[1];
      }

      const operation = [
        Math.sign(end[0] - start[0]),
        Math.sign(end[1] - start[1]),
      ];

      while (true) {
        map[`${start[0]}#${start[1]}`] = "#";

        if (start[0] === end[0] && start[1] === end[1]) {
          break;
        }

        start[0] += operation[0];
        start[1] += operation[1];
      }
    }
  });

  let settledSands = 0;
  let sandCoordinate = [500, 0];
  while (true) {
    const nextY = sandCoordinate[1] + 1;
    if (part === 1 && nextY > maxY) {
      return settledSands;
    }

    let thisX = sandCoordinate[0];

    // just settle early
    if (part === 2 && nextY > maxY + 1) {
      map[`${thisX}#${sandCoordinate[1]}`] = "o";
      settledSands += 1;
      sandCoordinate = [500, 0];
      continue;
    }

    if (!map[`${thisX}#${nextY}`]) {
      sandCoordinate = [thisX, nextY];
      continue;
    }
    // try left first
    if (!map[`${thisX - 1}#${nextY}`]) {
      sandCoordinate = [thisX - 1, nextY];
      continue;
    }
    if (!map[`${thisX + 1}#${nextY}`]) {
      sandCoordinate = [thisX + 1, nextY];
      continue;
    }

    // come to rest
    settledSands += 1;
    if (part === 2 && thisX === 500 && sandCoordinate[1] === 0) {
      return settledSands;
    }
    map[`${thisX}#${sandCoordinate[1]}`] = "o";
    sandCoordinate = [500, 0];
  }
};

console.log(run(2));
