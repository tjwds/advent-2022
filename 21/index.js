const TEST = false;

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, TEST ? "/test.txt" : "/input.txt"))
  .toString()
  .split("\n");

const numberMonkeyRegExp = /([a-z]{4}): ([0-9]+)/;
const mathMonkeyRegExp = /([a-z]{4}): ([a-z]{4}) ([+\-/*]) ([a-z]{4})/;

const partOne = () => {
  const monkeys = {};

  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };

  input.forEach((monkey) => {
    const numberMonkey = monkey.match(numberMonkeyRegExp);

    if (numberMonkey) {
      const [, name, num] = numberMonkey;
      monkeys[name] = () => Number(num);
      return;
    }

    const [, name, first, op, second] = monkey.match(mathMonkeyRegExp);
    monkeys[name] = () => operations[op](monkeys[first](), monkeys[second]());
  });

  return monkeys.root();
};

const partTwo = () => {
  const monkeys = {};

  const operations = {
    "+": (a, b) => {
      const resA = a();
      const resB = b();

      if (typeof resA === "function") {
        return (v) => resA(v - resB);
      }
      if (typeof resB === "function") {
        return (v) => resB(v - resA);
      }

      return resA + resB;
    },

    "-": (a, b) => {
      const resA = a();
      const resB = b();

      if (typeof resA === "function") {
        return (v) => resA(v + resB);
      }
      if (typeof resB === "function") {
        return (v) => resB(resA - v);
      }

      return resA - resB;
    },

    "*": (a, b) => {
      const resA = a();
      const resB = b();

      if (typeof resA === "function") {
        return (v) => resA(v / resB);
      }
      if (typeof resB === "function") {
        return (v) => resB(v / resA);
      }

      return resA * resB;
    },

    "/": (a, b) => {
      const resA = a();
      const resB = b();

      if (typeof resA === "function") {
        return (v) => resA(v * resB);
      }
      if (typeof resB === "function") {
        return (v) => resB(resA / v);
      }

      return resA / resB;
    },

    "=": (a, b) => {
      const resA = a();
      const resB = b();

      if (typeof resA === "function") {
        return resA(resB);
      }
      return resB(resA);
    },

    h: () => (v) => v,
  };

  input.forEach((monkey) => {
    const numberMonkey = monkey.match(numberMonkeyRegExp);

    if (numberMonkey) {
      const [, name, num] = numberMonkey;
      if (name === "humn") {
        monkeys[name] = operations.h;
        return;
      }
      monkeys[name] = () => Number(num);
      return;
    }

    let [, name, first, op, second] = monkey.match(mathMonkeyRegExp);

    if (name === "root") {
      op = "=";
    }
    monkeys[name] = () => {
      return operations[op](monkeys[first], monkeys[second]);
    };
  });

  return monkeys.root();
};

console.log(partOne());
console.log(partTwo());
