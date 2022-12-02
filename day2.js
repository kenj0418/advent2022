const fs = require("fs");
const { sum, maxIndex, readStringArrayFromFile, readArrayFromFile, readSingleLineArraysFromFile } = require("./lib");

const playerScore = {
  X: 1,
  Y: 2,
  Z: 3
}

const resultScore = {
  AX: 3,
  AY: 6,
  AZ: 0,
  BX: 0,
  BY: 3,
  BZ: 6,
  CX: 6,
  CY: 0,
  CZ: 3,
}

const calcScore = (round) => {
  return playerScore[round[1]] + resultScore[round.join("")];
};

const part2AdjustMatrix = {
  AX: 'Z',
  AY: 'X',
  AZ: 'Y',
  BX: 'X',
  BY: 'Y',
  BZ: 'Z',
  CX: 'Y',
  CY: 'Z',
  CZ: 'X',
}

const part2Adjust = (round) => {
  return [round[0], part2AdjustMatrix[round.join("")]];
}

const run = () => {
  const guide = readStringArrayFromFile("./input/day2.txt", "\n").map((line) => { return line.split(" ") }).map(part2Adjust);

  let total = sum(guide.map(calcScore));

  console.log(total);
}

module.exports = { run };