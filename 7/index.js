const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const cdRegExp = /^\$ cd (.+)/;
const lsRegExp = /^([0-9]+) .+/;

const getDirSizes = (input) => {
  const dirsToSize = {};
  const wd = [];
  input.forEach((command) => {
    const cdCmd = command.match(cdRegExp);
    if (cdCmd) {
      const [, dir] = cdCmd;
      if (dir === "..") {
        wd.pop();
        return;
      }
      const qualifiedDir =
        wd
          .filter((n) => n !== "/")
          .reduce((before, after) => before + (before ? "/" : "") + after, "") +
        dir;
      if (dirsToSize[qualifiedDir]) {
        throw new Error("hmm.");
      }
      dirsToSize[qualifiedDir] = 0;
      wd.push(qualifiedDir);
      return;
    }

    const lsCmd = command.match(lsRegExp);
    if (lsCmd) {
      const [, size] = lsCmd;
      wd.forEach((dir) => {
        dirsToSize[dir] += Number(size);
      });
      return;
    }
  });

  return dirsToSize;
};

const partOne = (input) => {
  const dirsToSize = getDirSizes(input);
  return Object.values(dirsToSize).reduce(
    (before, after) => (after > 100000 ? before : before + after),
    0
  );
};

const partTwo = (input) => {
  const dirsToSize = getDirSizes(input);
  // what a weird way to word this problem.
  const target = dirsToSize["/"] - (70000000 - 30000000);
  return Object.values(dirsToSize).reduce((before, after) => {
    if (after < before && after >= target) {
      return after;
    }
    return before;
  }, Infinity);
};

console.log(partOne(input), partTwo(input));
