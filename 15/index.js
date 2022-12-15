const fs = require("fs");
const path = require("path");

const input = fs
  //   .readFileSync(path.join(__dirname, "/test.txt"))
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const beaconRegExp =
  /Sensor at x=(-?[0-9]+), y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), y=(-?[0-9]+)/;

const partOne = (targetY) => {
  const knownGood = new Set();
  const beacons = new Set();

  input.forEach((inputString) => {
    const [, sensorX, sensorY, beaconX, beaconY] = inputString
      .match(beaconRegExp)
      .map(Number);
    beacons.add(`${beaconX}#${beaconY}`);

    const dist = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

    for (let x = sensorX - dist; x <= sensorX + dist; x++) {
      // XXX garbage, could optimize
      if (Math.abs(sensorX - x) + Math.abs(sensorY - targetY) <= dist) {
        knownGood.add(`${x}#${targetY}`);
      }
    }
  });

  // XXX horrible hack.
  beacons.forEach((beacon) => knownGood.delete(beacon));
  return knownGood.size;
};

const partTwo = (maxXY) => {
  const edgesAndBeacons = new Set();

  const addIfInRange = (x, y) => {
    if (
      x >= 0 &&
      x <= maxXY &&
      y >= 0 &&
      y <= maxXY &&
      !internalTests.some((test) => test(x, y))
    ) {
      edgesAndBeacons.add(`${x}#${y}`);
    }
  };

  const internalTests = [];
  // XXX absurd.
  const internalOrBorderTests = [];

  // create map of internal tests in a first pass so our set doesn't explode in
  // size
  input.forEach((inputString) => {
    const [, sensorX, sensorY, beaconX, beaconY] = inputString
      .match(beaconRegExp)
      .map(Number);
    const dist = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    internalTests.push(
      (x, y) => Math.abs(sensorX - x) + Math.abs(sensorY - y) < dist
    );
    internalOrBorderTests.push(
      (x, y) => Math.abs(sensorX - x) + Math.abs(sensorY - y) <= dist
    );
  });

  input.forEach((inputString) => {
    const [, sensorX, sensorY, beaconX, beaconY] = inputString
      .match(beaconRegExp)
      .map(Number);

    // just add the beacon
    addIfInRange(beaconX, beaconY);

    const dist = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

    [1, -1].forEach((direction) => {
      let i = 0;
      for (let opdist = dist; opdist >= 0; opdist--) {
        const x = sensorX + direction * opdist;
        addIfInRange(x, sensorY);
        addIfInRange(x, sensorY + i);
        addIfInRange(x, sensorY - i);
        i++;
      }
    });
  });

  // For each set, find some candidate empty locations:
  const hasEmptySpace = (x, y) => {
    return (
      !edgesAndBeacons.has(`${x + 1}#${y}`) &&
      edgesAndBeacons.has(`${x + 1}#${y + 1}`) &&
      edgesAndBeacons.has(`${x + 1}#${y - 1}`) &&
      edgesAndBeacons.has(`${x + 2}#${y}`)
    );
  };

  edgesAndBeacons.forEach((edge) => {
    const [x, y] = edge.split("#").map(Number);
    if (
      hasEmptySpace(x, y) &&
      !internalOrBorderTests.some((test) => test(x + 1, y))
    ) {
      console.log((x + 1) * 4000000 + y);
    }
  });
};

// console.log(partOne(2000000));

partTwo(4000000);
// partTwo(20); // 56000011
