const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const moveInfo = {
  'R': { x: 1, y: 0 },
  'L': { x: -1, y: 0 },
  'U': { x: 0, y: -1 },
  'D': { x: 0, y: 1 }
};

const distanceHeadTail = (state) => {
  return Math.max(Math.abs(state.head.x - state.tail.x), Math.abs(state.head.y - state.tail.y));
}

const adjustTail = (state) => {
  if (distanceHeadTail(state) <= 1) {
    return; // no action needed
  }

  const xDir = Math.sign(state.head.x - state.tail.x);
  const yDir = Math.sign(state.head.y - state.tail.y);

  if (state.head.x == state.tail.x) {
    // same col
    state.tail.y += yDir;
  } else if (state.head.y == state.tail.y) {
    // same row
    state.tail.x += xDir;
  } else {
    // diag
    state.tail.x += xDir;
    state.tail.y += yDir;
  }

  if (distanceHeadTail(state) > 1) {
    throw new Error(`Move failed: ${JSON.stringify(state)}`);
  }
}

const makeMove = (state, move) => {
  const info = moveInfo[move];

  state.head.x += info.x;
  state.head.y += info.y;

  adjustTail(state);
  state.visited[`${state.tail.x}: ${state.tail.y}`] = true;
}

const run = (filename) => {
  const moves = readStringArrayFromFile(filename, "\n").map((line) => {
    return line.split(" ")
  }).flatMap((parts) => {
    return [...Array(parseInt(parts[1])).keys()].map(() => { return parts[0] });
  });

  let state = {
    head: {
      x: 0,
      y: 0
    },
    tail: {
      x: 0,
      y: 0
    },
    visited: {} // { "0:0": true }
  };

  moves.forEach((move) => {
    makeMove(state, move)
  });

  console.log(`Part 1: ${Object.keys(state.visited).length}`);
  console.log(`Part 2: ${0}`);

}

module.exports = { run };