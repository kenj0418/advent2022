const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const numKnots = 10;

const moveInfo = {
  'R': { x: 1, y: 0 },
  'L': { x: -1, y: 0 },
  'U': { x: 0, y: -1 },
  'D': { x: 0, y: 1 }
};

const distanceBetween = (k1, k2) => {
  return Math.max(Math.abs(k1.x - k2.x), Math.abs(k1.y - k2.y));
}

const adjustKnots = (k1, k2) => {
  if (distanceBetween(k1, k2) <= 1) {
    return; // no action needed
  }

  const xDir = Math.sign(k1.x - k2.x);
  const yDir = Math.sign(k1.y - k2.y);

  if (k1.x == k2.x) {
    // same col
    k2.y += yDir;
  } else if (k1.y == k2.y) {
    // same row
    k2.x += xDir;
  } else {
    // diag
    k2.x += xDir;
    k2.y += yDir;
  }
}

const makeMove = (state, move) => {
  const info = moveInfo[move];

  state.knots[0].x += info.x;
  state.knots[0].y += info.y;

  for (let i = 1; i < numKnots; i++) {
    adjustKnots(state.knots[i - 1], state.knots[i]);
  }

  state.visited[`${state.knots[numKnots - 1].x}:${state.knots[numKnots - 1].y}`] = true;
}

const run = (filename) => {
  const moves = readStringArrayFromFile(filename, "\n").map((line) => {
    return line.split(" ")
  }).flatMap((parts) => {
    return [...Array(parseInt(parts[1])).keys()].map(() => { return parts[0] });
  });

  let state = {
    knots: [...Array(numKnots).keys()].map(() => { return { x: 0, y: 0 } }),
    visited: {} // { "0:0": true }
  };

  moves.forEach((move) => {
    makeMove(state, move)
  });

  console.log(`Part 1: ${Object.keys(state.visited).length}`);
  console.log(`Part 2: ${0}`);

}

module.exports = { run };