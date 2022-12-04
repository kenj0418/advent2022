const fs = require("fs");
const { sum, readStringArrayFromFile } = require("./lib");

const getCommonItem = (sacks) => {
  const primeSack = sacks[0];
  const otherSacks = sacks.slice(1);

  for (let i = 0; i < primeSack.length; i++) {
    let found = true;

    for (let j = 0; j < otherSacks.length && found; j++) {
      if (otherSacks[j].indexOf(primeSack[i]) < 0) {
        found = false;
      }
    }

    if (found) {
      return primeSack[i];
    }
  }

  throw new Error('NO COMMON ITEM');
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

const report = (sacks, st) => {
  const commonItems = sacks.map(getCommonItem);
  const total = sum(commonItems.map(getPriority));
  console.log(`${st}: ${total}`);
}

const run = () => {
  const allSacks = readStringArrayFromFile("./input/day3.txt", "\n");

  const splitSacks = allSacks.map((line) => {
    return [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2)
    ];
  });

  let sackGroups = [];
  for (let i = 0; i < allSacks.length; i += 3) {
    sackGroups.push([allSacks[i], allSacks[i + 1], allSacks[i + 2]]);
  }

  report(splitSacks, 'Part 1');
  report(sackGroups, 'Part 2');
}

module.exports = { run };