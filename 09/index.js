const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const moveRegex = /([A-Z]) ([0-9]+)/;

const getTailMove = (H, T) => {
  const [hY, hX] = H;
  const [tY, tX] = T;

  let result = [0, 0];
  // if the tail is ever exactly two away in one direction, move in that
  // direction
  //
  // thought about doing a map here and iterating over it, but… meh
  if (hX === tX) {
    if (hY - 2 === tY) {
      result = [1, 0];
    } else if (hY + 2 === tY) {
      result = [-1, 0];
    }
  } else if (hY === tY) {
    if (hX - 2 === tX) {
      result = [0, 1];
    } else if (hX + 2 === tX) {
      result = [0, -1];
    }
  } else {
    // if the head and tail are not touching and aren't in the same column,
    // move one step diagonally in the same direction
    //
    // we already tested row and column, so now it's testing whether or not
    // they're touching diagonally.
    const distX = hX - tX;
    const distY = hY - tY;

    if (Math.abs(distX) === 1 && Math.abs(distY) === 1) {
      return result;
    }

    return [Math.sign(distY), Math.sign(distX)];
  }

  return result;
};

const getKnotMoves = (input, numKnots) => {
  const pieces = {};
  for (let i = 1; i <= numKnots; i++) {
    pieces[i] = [0, 0];
  }
  const H = pieces[1];
  const lastPieceMoves = new Set();

  const dirs = {
    R: [0, 1],
    L: [0, -1],
    U: [-1, 0],
    D: [1, 0],
  };

  input.forEach((line) => {
    const [, d, a] = line.match(moveRegex);
    const amount = Number(a);
    const dir = dirs[d];

    for (let i = 0; i < amount; i++) {
      H[0] += dir[0];
      H[1] += dir[1];

      for (let j = 1; j < numKnots; j++) {
        const HA = pieces[j];
        const T = pieces[j + 1];
        const [moveY, moveX] = getTailMove(HA, T);
        T[0] += moveY;
        T[1] += moveX;

        if (j === numKnots - 1) {
          lastPieceMoves.add(`${T[0]}#${T[1]}`);
        }
      }
    }
  });

  return lastPieceMoves.size;
};

const partOne = (input) => getKnotMoves(input, 2);
const partTwo = (input) => getKnotMoves(input, 10);

console.log(partOne(input), partTwo(input));
