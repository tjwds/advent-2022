const fs = require("fs");
const path = require("path");

const letterToPriority = (char) => {
  const code = char.charCodeAt();
  if (code >= 97) {
    return code - 96;
  }
  return code - 38;
};

const getSharedChar = (str1, str2) => {
  const set = new Set(str1.split(""));
  const list2 = str2.split("");
  for (let i = 0; i < list2.length; i++) {
    const char = list2[i];
    if (set.has(char)) {
      return char;
    }
  }
};

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = (input) => {
  return input.reduce((score, line) => {
    const halfway = line.length / 2;
    const strings = [line.slice(0, halfway), line.slice(halfway)];

    const sharedChar = getSharedChar(...strings);

    return score + letterToPriority(sharedChar);
  }, 0);
};

// Really looking forward to the js iterators proposal landing.
const tripleGenerator = function* (input) {
  let i = 0;
  while (i < input.length) {
    yield [input[i].split(""), input[i + 1].split(""), input[i + 2].split("")];
    i += 3;
  }
};

const partTwo = (input) => {
  const takeThree = tripleGenerator(input);
  let score = 0;
  for (const triple of takeThree) {
    const setOfFirst = new Set(triple[0]);
    const sharedFirstTwo = new Set(
      triple[1].filter((char) => setOfFirst.has(char))
    );

    const finalTriple = triple[2];
    for (let i = 0; i < finalTriple.length; i++) {
      const char = finalTriple[i];
      if (sharedFirstTwo.has(char)) {
        score += letterToPriority(char);
        break;
      }
    }
  }
  return score;
};

console.log(partOne(input), partTwo(input));
