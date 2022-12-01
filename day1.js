const fs = require("fs");
const { sum, maxIndex, readSingleLineArraysFromFile } = require("./lib");

const run = () => {
  const elves = readSingleLineArraysFromFile("./input/day1.txt");

  let elfSums = elves.map((arr) => {
    return sum(arr);
  });

  let total = 0;
  for (let i = 0; i < 3; i++) {
    const maxI = maxIndex(elfSums);
    total += elfSums[maxI];
    elfSums = elfSums.slice(0, maxI).concat(elfSums.slice(maxI + 1));
  }

  console.log(total);
}

module.exports = { run };