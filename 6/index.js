const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

// const input = 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw';

const findDistinct = (input, length) => {
  for (let i = 0; i < input.length; i++) {
    const set = new Set();
    for (let j = i; j < i + length; j++) {
      set.add(input[j]);
    }

    if (set.size === length) {
      return i + length;
    }
  }
};

console.log(findDistinct(input, 4), findDistinct(input, 14));
