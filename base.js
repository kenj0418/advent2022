const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const run = (filename) => {
  const st = readStringArrayFromFile(filename, "\n");

  console.log(st);

  console.log(`Part 1: ${0}`);
  console.log(`Part 2: ${0}`);

}

module.exports = { run };