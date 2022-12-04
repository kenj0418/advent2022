const fs = require("fs");
const { readStringArrayFromFile } = require("./lib");

const isContained = (r1, r2) => {
  return (r1[0] <= r2[0]) && (r1[1] >= r2[1]);
}

const isEitherContained = (ranges) => {
  return isContained(ranges[0], ranges[1]) || isContained(ranges[1], ranges[0]);
}

const run = () => {
  const allAssignments = readStringArrayFromFile("./input/day4.txt", "\n").map((line) => {
    return line.split(",").map((st) => {
      return st.split("-").map((st) => {
        return parseInt(st);
      })
    })
  });

  const contained = allAssignments.filter(isEitherContained);

  console.log(`part 1: ${contained.length}`);
}

module.exports = { run };

//359 too high - was due to not using parseInt, and comparing as strings