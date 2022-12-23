const TEST = false;

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, TEST ? "/test.txt" : "/input.txt"))
  .toString();

const walkinRegExp = /[0-9]+[LR]?/g;

const partOne = () => {
  const [mapInput, instructionsInput] = input.split("\n\n");

  const map = {};

  let x;
  let y;
  let facingDirection = 0;

  mapInput.split("\n").forEach((line, lineY) => {
    line.split("").forEach((char, lineX) => {
      if (char !== " ") {
        map[`${lineX + 1}#${lineY + 1}`] = char;
        if (typeof x === "undefined") {
          x = lineX + 1;
          y = lineY + 1;
        }
      }
    });
  });

  instructionsInput.match(walkinRegExp).forEach((instruction) => {
    const amount = Number(instruction.match(/[0-9]+/));
    const rotation = instruction.slice(-1);

    // walk until I hit a wall
    // get a slice of everything in this direction
    let filter;
    if (facingDirection === 0 || facingDirection === 2) {
      filter = (i) => new RegExp(`#${y}$`).test(i);
    } else {
      filter = (i) => new RegExp(`^${x}#`).test(i);
    }

    // These technically aren't guaranteed to be in order, but they will be.
    const walkables = Object.keys(map).filter(filter);
    let start = walkables.indexOf(`${x}#${y}`);

    let direction = facingDirection === 0 || facingDirection === 1 ? 1 : -1;
    let walked = 0;

    while (walked < amount) {
      let next = start + direction;
      if (next < 0) {
        next = walkables.length - 1;
      }
      if (next === walkables.length) {
        next = 0;
      }
      const nextKey = walkables[next];
      if (map[nextKey] === "#") {
        break;
      }

      const [newX, newY] = nextKey.split("#");

      if (facingDirection === 0 || facingDirection === 2) {
        x = Number(newX);
      } else {
        y = Number(newY);
      }
      start = next;
      walked += 1;
    }

    // rotate
    if (rotation === "R") {
      facingDirection += 1;
      if (facingDirection === 4) {
        facingDirection = 0;
      }
    } else if (rotation === "L") {
      facingDirection -= 1;
      if (facingDirection === -1) {
        facingDirection = 3;
      }
    }
  });

  return 1000 * y + 4 * x + facingDirection;
};

console.log(partOne());
