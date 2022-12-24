const TEST = false;

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, TEST ? "/test.txt" : "/input.txt"))
  .toString()
  .split("\n");

let fieldStateForBlizzards = {
  minX: 1,
  maxX: -Infinity,
  minY: 1,
  maxY: -Infinity,
};

const Blizzard = class {
  constructor(direction) {
    this.direction = direction;
  }

  calculateMoveForPosition(position) {
    let [x, y] = position.split("#").map(Number);

    if (this.direction === "<") {
      x -= 1;
      if (x < fieldStateForBlizzards.minX) {
        x = fieldStateForBlizzards.maxX;
      }
    } else if (this.direction === ">") {
      x += 1;
      if (x > fieldStateForBlizzards.maxX) {
        x = fieldStateForBlizzards.minX;
      }
    }
    if (this.direction === "^") {
      y -= 1;
      if (y < fieldStateForBlizzards.minY) {
        y = fieldStateForBlizzards.maxY;
      }
    }
    if (this.direction === "v") {
      y += 1;
      if (y > fieldStateForBlizzards.maxY) {
        y = fieldStateForBlizzards.minY;
      }
    }

    return `${x}#${y}`;
  }
};

const RoundHolder = class {
  constructor() {
    this.availableSpaces = new Set();
  }

  get(number) {
    let blizzardRound = this[number];
    // we'll only ever be calculating one round in advance
    if (!blizzardRound) {
      blizzardRound = this[number - 1].calculateNextRound();
      this[number] = blizzardRound;
    }

    return blizzardRound;
  }
};

const roundHolder = new RoundHolder();

const BlizzardRound = class {
  constructor(roundNumber) {
    this.roundNumber = roundNumber;

    this.blizzardToPosition = new Map();
    this.positionHasBlizzard = new Set();
    this.possibleMovesForPositionNextRoundSaver = new Map();

    roundHolder[roundNumber] = this;
  }

  visualizeSelf() {
    let landscape = "";
    for (
      let y = fieldStateForBlizzards.minY;
      y <= fieldStateForBlizzards.maxY;
      y++
    ) {
      for (
        let x = fieldStateForBlizzards.minX;
        x <= fieldStateForBlizzards.maxX;
        x++
      ) {
        landscape += this.positionHasBlizzard.has(`${x}#${y}`) ? "@" : ".";
      }
      landscape += "\n";
    }

    landscape += "\n";
    console.log(landscape);
  }

  initializeBlizzard(position, direction) {
    const blizzard = new Blizzard(direction);

    this.blizzardToPosition.set(blizzard, position);
    this.positionHasBlizzard.add(position);
  }

  calculateNextRound() {
    const nextBlizzardRound = new BlizzardRound(this.roundNumber + 1);
    roundHolder[this.roundNumber + 1] = nextBlizzardRound;

    // these iterators are annoying.
    const iterator = this.blizzardToPosition.entries();
    let next = iterator.next();
    while (!next.done) {
      const [blizzard, position] = next.value;
      nextBlizzardRound.initializeBlizzard(
        blizzard.calculateMoveForPosition(position),
        blizzard.direction
      );
      next = iterator.next();
    }

    // nextBlizzardRound.visualizeSelf();
    return nextBlizzardRound;
  }

  possibleMovesForPositionNextRound(x, y) {
    const position = `${x}#${y}`;

    let possibleMoves =
      this.possibleMovesForPositionNextRoundSaver.get(position);
    if (possibleMoves) {
      return possibleMoves;
    }
    const nextRound = roundHolder.get(this.roundNumber + 1);
    const { positionHasBlizzard } = nextRound;
    const { availableSpaces } = roundHolder;

    // In priority order
    possibleMoves = [
      `${x + 1}#${y}`,
      `${x}#${y + 1}`,
      `${x - 1}#${y}`,
      `${x}#${y - 1}`,
      position,
    ].filter(
      (nextPosition) =>
        availableSpaces.has(nextPosition) &&
        !positionHasBlizzard.has(nextPosition)
    );

    // TODO add some heuristic to prevent lolly-gagging
    this.possibleMovesForPositionNextRoundSaver.set(position, possibleMoves);

    return possibleMoves;
  }
};

roundHolder[0] = new BlizzardRound(0);

const doIt = (isPartOne = true) => {
  const availableSpaces = roundHolder.availableSpaces;
  const firstRound = roundHolder[0];
  let target;

  input.forEach((row, y) => {
    row.split("").forEach((column, x) => {
      if (column !== "#") {
        const position = `${x}#${y}`;
        availableSpaces.add(position);

        if (y === input.length - 1) {
          target = position;
        } else {
          if (column !== ".") {
            firstRound.initializeBlizzard(position, column);
          }

          if (fieldStateForBlizzards.maxX < x) {
            fieldStateForBlizzards.maxX = x;
          }
          if (fieldStateForBlizzards.maxY < y) {
            fieldStateForBlizzards.maxY = y;
          }
        }
      }
    });
  });
  //   firstRound.visualizeSelf();

  // start at 1, 0
  const moves = ["1#0#0#0"];
  const goals = [target, `1#0`, target];
  const alreadyConsidered = new Set();
  const moveYourFeet = (yourPositionAndMove) => {
    const [x, y, roundNumber, goalsAchieved] = yourPositionAndMove
      .split("#")
      .map(Number);
    const myTarget = isPartOne ? target : goals[goalsAchieved];
    const round = roundHolder.get(roundNumber);
    const nextRoundIdentityString = `#${roundNumber + 1}`;
    const possibleMoves = round.possibleMovesForPositionNextRound(x, y);

    for (let i = 0; i < possibleMoves.length; i++) {
      const possibleMove = possibleMoves[i];
      const goalString = `#${goalsAchieved}`;
      let possibleMoveWithIdentity =
        possibleMove + nextRoundIdentityString + goalString;
      if (!alreadyConsidered.has(possibleMoveWithIdentity)) {
        if (possibleMove === myTarget) {
          if (isPartOne) {
            return roundNumber;
          } else {
            if (goalsAchieved === 2) {
              return roundNumber;
            } else {
              possibleMoveWithIdentity =
                possibleMove +
                nextRoundIdentityString +
                `#${goalsAchieved + 1}`;
            }
          }
        }
        moves.push(possibleMoveWithIdentity);
        alreadyConsidered.add(possibleMoveWithIdentity);
      }
    }

    return false;
  };

  while (true) {
    const nextMove = moves.shift();
    const maybeHaveTarget = moveYourFeet(nextMove);
    if (maybeHaveTarget) {
      return maybeHaveTarget + 1;
    }
  }
};

console.log(doIt(false));
