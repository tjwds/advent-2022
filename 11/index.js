// const monkeys = {
//   0: {
//     items: [79n, 98n],
//     operation: (x) => x * 19n,
//     test: (x) => !(x % 23n),
//     testTrueTarget: "2",
//     testFalseTarget: "3",
//     numberInspected: 0,
//   },
//   1: {
//     items: [54n, 65n, 75n, 74n],
//     operation: (x) => x + 6n,
//     test: (x) => !(x % 19n),
//     testTrueTarget: "2",
//     testFalseTarget: "0",
//     numberInspected: 0,
//   },
//   2: {
//     items: [79n, 60n, 97n],
//     operation: (x) => x ** 2n,
//     test: (x) => !(x % 13n),
//     testTrueTarget: "1",
//     testFalseTarget: "3",
//     numberInspected: 0,
//   },
//   3: {
//     items: [74n],
//     operation: (x) => x + 3n,
//     test: (x) => !(x % 17n),
//     testTrueTarget: "0",
//     testFalseTarget: "1",
//     numberInspected: 0,
//   },
// };

// const modulus = [23n, 19n, 13n, 17n].reduce((a, b) => a * b, 1n);

const monkeys = {
  0: {
    items: [91n, 54n, 70n, 61n, 64n, 64n, 60n, 85n],
    operation: (x) => x * 13n,
    test: (x) => !(x % 2n),
    testTrueTarget: "5",
    testFalseTarget: "2",
    numberInspected: 0,
  },
  1: {
    items: [82n],
    operation: (x) => x + 7n,
    test: (x) => !(x % 13n),
    testTrueTarget: "4",
    testFalseTarget: "3",
    numberInspected: 0,
  },
  2: {
    items: [84n, 93n, 70n],
    operation: (x) => x + 2n,
    test: (x) => !(x % 5n),
    testTrueTarget: "5",
    testFalseTarget: "1",
    numberInspected: 0,
  },
  3: {
    items: [78n, 56n, 85n, 93n],
    operation: (x) => x * 2n,
    test: (x) => !(x % 3n),
    testTrueTarget: "6",
    testFalseTarget: "7",
    numberInspected: 0,
  },
  4: {
    items: [64n, 57n, 81n, 95n, 52n, 71n, 58n],
    operation: (x) => x ** 2n,
    test: (x) => !(x % 11n),
    testTrueTarget: "7",
    testFalseTarget: "3",
    numberInspected: 0,
  },
  5: {
    items: [58n, 71n, 96n, 58n, 68n, 90n],
    operation: (x) => x + 6n,
    test: (x) => !(x % 17n),
    testTrueTarget: "4",
    testFalseTarget: "1",
    numberInspected: 0,
  },
  6: {
    items: [56n, 99n, 89n, 97n, 81n],
    operation: (x) => x + 1n,
    test: (x) => !(x % 7n),
    testTrueTarget: "0",
    testFalseTarget: "2",
    numberInspected: 0,
  },
  7: {
    items: [68n, 72n],
    operation: (x) => x + 8n,
    test: (x) => !(x % 19n),
    testTrueTarget: "6",
    testFalseTarget: "0",
    numberInspected: 0,
  },
};

// it's all calvinball at this point
const modulus = [2n, 13n, 5n, 3n, 11n, 17n, 7n, 19n].reduce(
  (a, b) => a * b,
  1n
);

const haveFun = (shouldWorry) => {
  let numberMonkeys = Object.keys(monkeys).length;
  for (let rounds = 0; rounds < (shouldWorry ? 10000 : 20); rounds++) {
    for (let monkeyNo = 0; monkeyNo < numberMonkeys; monkeyNo++) {
      const monkey = monkeys[monkeyNo];
      const { items, operation, test, testTrueTarget, testFalseTarget } =
        monkey;

      const { length } = items;
      for (let i = 0; i < length; i++) {
        let item = items.shift();
        item = operation(item) / (shouldWorry ? 1n : 3n);

        monkeys[test(item) ? testTrueTarget : testFalseTarget].items.push(
          item % modulus
        );

        monkey.numberInspected += 1;
      }
    }
  }

  const inspected = Object.values(monkeys)
    .map((monkey) => monkey.numberInspected)
    .sort((a, b) => b - a);
  return inspected[0] * inspected[1];
};

// console.log(haveFun(false));
console.log(haveFun(true));
