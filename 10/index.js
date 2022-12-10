const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const addxRegExp = /^addx (-?[0-9]+)/;

const incrementCycle = (state) => {
  state.cycles += 1;
  const { cycles, value } = state;
  if (!((cycles - 20) % 40)) {
    state.rssi += value * cycles;
  }

  if ([value, value + 1, value + 2].includes(cycles % 40)) {
    state.screen += "#";
  } else {
    state.screen += ".";
  }
};

const generateOutput = (input) => {
  const state = {
    value: 1,
    cycles: 0,
    rssi: 0,
    screen: "",
  };

  input.forEach((line) => {
    if (line === "noop") {
      incrementCycle(state);
    } else {
      incrementCycle(state);
      incrementCycle(state);

      const [, n] = line.match(addxRegExp);
      const number = Number(n);
      state.value += number;
    }
  });

  // XXX not entirely clear if it matters if we _end_ on a cycle.

  state.screen = state.screen.match(/.{1,40}/g).join("\n");
  return state;
};

const output = generateOutput(input);
console.log(output.rssi);
console.log(output.screen);
