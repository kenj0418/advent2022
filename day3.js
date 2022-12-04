const fs = require("fs");
const { sum, readStringArrayFromFile } = require("./lib");

const getCommonItem = (sackPair) => {
  const sack1 = sackPair[0];
  const sack2 = sackPair[1];

  for (let i = 0; i < sack1.length; i++) {
    if (sack2.indexOf(sack1[i]) >= 0) {
      return sack1[i];
    }
  }
  return '?';
}

const getCommonItem2 = (sackPair) => {
  const sack1 = sackPair[0];
  const sack2 = sackPair[1];
  const sack3 = sackPair[2];

  for (let i = 0; i < sack1.length; i++) {
    if (sack2.indexOf(sack1[i]) >= 0 && sack3.indexOf(sack1[i]) >= 0) {
      return sack1[i];
    }
  }
  return '?';
}

const getPriority = (item) => {
  const ch = item.charCodeAt(0);
  if (item >= 'a' && item <= 'z') {
    return ch - 'a'.charCodeAt(0) + 1;
  } else if (item >= 'A' && item <= 'Z') {
    return ch - 'A'.charCodeAt(0) + 27;
  } else {
    return 0;
  }
};

const runpart2 = () => {
  const allSacks = readStringArrayFromFile("./input/day3.txt", "\n");
  let sacks = [];
  for (let i = 0; i < allSacks.length; i += 3) {
    sacks.push([allSacks[i], allSacks[i + 1], allSacks[i + 2]]);
  }

  const commonItems = sacks.map(getCommonItem2);
  const total = sum(commonItems.map(getPriority));

  console.log(`part 2: ${total}`);
}

const run = () => {
  const sacks = readStringArrayFromFile("./input/day3.txt", "\n").map((line) => {
    return [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2)
    ];
  });

  const commonItems = sacks.map(getCommonItem);
  const total = sum(commonItems.map(getPriority));

  console.log(`part 1: ${total}`);

  runpart2();
}

module.exports = { run };