const fs = require("fs");
const { readStringArrayFromFile } = require("./lib");

const isStart = (window, windowSize) => {
  if (window.length < windowSize) {
    return false;
  }

  for (let i = 0; i < windowSize - 1; i++) {
    for (let j = i + 1; j < windowSize; j++) {
      if (window[i] == window[j]) {
        return false;
      }
    }
  }

  return true;
}

const findStartWindow = (st, windowSize) => {
  let found = -1;
  let window = [];
  for (let i = 0; i < st.length && found < 0; i++) {
    window.push(st[i]);
    if (window.length > windowSize) {
      window.shift();
    }
    if (isStart(window, windowSize)) {
      found = i;
    }
  }

  return found;
}

const run = () => {
  const st = readStringArrayFromFile("./input/day6.txt", "\n").join("").replace(/ /g, "");

  console.log(`result part 1: ${findStartWindow(st, 5)}`);
  console.log(`result part 2: ${findStartWindow(st, 14) + 1}`);
}

module.exports = { run };