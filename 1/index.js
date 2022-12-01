const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/inputOne.txt")).toString();

const partOne = (input) => {
  const elfLists = input.split("\n\n");
  return elfLists.reduce((before, elfList) => {
    const thisList = elfList
      .split("\n")
      .map(Number)
      .reduce((a, b) => a + b, 0);
    return thisList > before ? thisList : before;
  }, 0);
};

const partTwo = (input) => {
  const elfLists = input.split("\n\n");
  const elfCalories = elfLists.map((elfList) =>
    elfList
      .split("\n")
      .map(Number)
      .reduce((a, b) => a + b, 0)
  );
  elfCalories.sort((a, b) => b - a);
  return elfCalories[0] + elfCalories[1] + elfCalories[2];
};

console.log(partTwo(input));
