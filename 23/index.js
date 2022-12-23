const TEST = false;

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, TEST ? "/test2.txt" : "/input.txt"))
  .toString()
  .split("\n");

const elvesToAscii = (elves) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  elves.forEach((elf) => {
    const [x, y] = elf.split("#").map(Number);
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });

  let string = "";
  for (let y = Math.min(minY, 0); y <= maxY; y++) {
    for (let x = Math.min(minX, 0); x <= maxX; x++) {
      string += elves.has(`${x}#${y}`) ? "#" : ".";
    }
    string += "\n";
  }

  return string;
};

const moveElves = (partOne = true) => {
  let elves = new Set();
  // N S W E
  const movesAndTheirChecks = [
    [
      [0, -1],
      [
        [0, -1],
        [-1, -1],
        [1, -1],
      ],
    ],
    [
      [0, 1],
      [
        [0, 1],
        [-1, 1],
        [1, 1],
      ],
    ],
    [
      [-1, 0],
      [
        [-1, 0],
        [-1, -1],
        [-1, 1],
      ],
    ],
    [
      [1, 0],
      [
        [1, 0],
        [1, -1],
        [1, 1],
      ],
    ],
  ];

  const neighbors = [
    [0, 1],
    [-1, 1],
    [1, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ];

  input.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "#") {
        elves.add(`${x}#${y}`);
      }
    });
  });

  let rounds = 1;

  while (true) {
    // XXX This is kind of absurd.
    const proposedMoves = new Map();
    const proposedMoveInverse = new Map();
    const bannedMoves = new Set();
    const elvesWhoWouldNotMove = [];

    elves.forEach((elf) => {
      const [x, y] = elf.split("#").map(Number);
      if (
        !neighbors.some(([neighborX, neighborY]) =>
          elves.has(`${x + neighborX}#${y + neighborY}`)
        )
      ) {
        elvesWhoWouldNotMove.push(elf);
        return;
      }

      move: for (let i = 0; i < movesAndTheirChecks.length; i++) {
        const [theMove, moveChecks] = movesAndTheirChecks[i];

        for (let j = 0; j < moveChecks.length; j++) {
          const [checkX, checkY] = moveChecks[j];
          const checkString = `${x + checkX}#${y + checkY}`;

          if (elves.has(checkString)) {
            continue move;
          }
        }

        const moveString = `${x + theMove[0]}#${y + theMove[1]}`;

        const seatTaken = proposedMoveInverse.get(moveString);
        if (seatTaken) {
          bannedMoves.add(moveString);
          proposedMoves.delete(seatTaken);
          proposedMoveInverse.delete(moveString);
        } else {
          if (!bannedMoves.has(moveString)) {
            proposedMoves.set(elf, moveString);
            proposedMoveInverse.set(moveString, elf);
          }
        }

        break;
      }
    });

    if (elvesWhoWouldNotMove.length === elves.size) {
      break;
    }

    const nextElves = new Set();
    elves.forEach((elf) => {
      let proposedMove = proposedMoves.get(elf);
      if (proposedMove) {
        nextElves.add(proposedMove);
      } else {
        nextElves.add(elf);
      }
    });

    elves = nextElves;

    // haha
    movesAndTheirChecks.push(movesAndTheirChecks.shift());

    if (partOne && rounds === 10) {
      break;
    }

    rounds++;
  }

  if (partOne) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    elves.forEach((elf) => {
      const [x, y] = elf.split("#").map(Number);
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    });

    // lol
    minX--;
    minY--;

    return (maxX - minX) * (maxY - minY) - elves.size;
  }
  return rounds;
};

console.log(moveElves(false));
