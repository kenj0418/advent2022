const fs = require("fs");
const { sum, maxIndex } = require("./lib");

const run = () => {
  const elves = fs.readFileSync("./input/day1.txt").toString().split("\n\n").map((data) => {
    return data.split("\n").map((n) => {
      return parseInt(n);
    });
  });

  let elfSums = elves.map((arr) => {
    return sum(arr);
  });

  let total = 0;
  let maxI = maxIndex(elfSums);
  total += elfSums[maxI];
  elfSums = elfSums.slice(0, maxI).concat(elfSums.slice(maxI + 1));
  maxI = maxIndex(elfSums);
  total += elfSums[maxI];
  elfSums = elfSums.slice(0, maxI).concat(elfSums.slice(maxI + 1));
  maxI = maxIndex(elfSums);
  total += elfSums[maxI];


  console.log(total);
}

module.exports = { run };