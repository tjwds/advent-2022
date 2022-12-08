const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = (input) => {
  const vec = {};
  const width = input[0].length;
  const height = input.length;

  for (let i = 0; i < height; i++) {
    const line = input[i];
    for (let j = 0; j < width; j++) {
      vec[`${i}#${j}`] = Number(line[j]);
    }
  }

  let visible = 0;
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
        visible++;
        continue;
      }

      let thisTree = vec[`${i}#${j}`];
      for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
        const [incX, incY] = directions[dirIndex];
        let isVisible = true;
        for (
          let x = j + incX, y = i + incY;
          x < width && x >= 0 && y < height && y >= 0;
          x += incX, y += incY
        ) {
          // lol it took a long time to track down this bug:
          // const testTree = vec[`${x}#${y}`];
          const testTree = vec[`${y}#${x}`];

          if (testTree >= thisTree) {
            isVisible = false;
            break;
          }
        }
        if (isVisible) {
          visible++;
          break;
        }
      }
    }
  }

  return visible;
};

const partTwo = (input) => {
  const vec = {};
  const width = input[0].length;
  const height = input.length;

  for (let i = 0; i < height; i++) {
    const line = input[i];
    for (let j = 0; j < width; j++) {
      vec[`${i}#${j}`] = Number(line[j]);
    }
  }

  let bestScenicScore = 0;
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
        // would multiply by zero anyway
        continue;
      }

      let thisTree = vec[`${i}#${j}`];
      let thisScenic = 1;
      for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
        const [incX, incY] = directions[dirIndex];
        let dirScenic = 0;

        for (
          let x = j + incX, y = i + incY;
          x < width && x >= 0 && y < height && y >= 0;
          x += incX, y += incY
        ) {
          dirScenic += 1;
          const testTree = vec[`${y}#${x}`];

          if (testTree >= thisTree) {
            break;
          }
        }

        thisScenic *= dirScenic;
      }

      if (thisScenic > bestScenicScore) {
        bestScenicScore = thisScenic;
      }
    }
  }

  return bestScenicScore;
};

console.log(partTwo(input));
