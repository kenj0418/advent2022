const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const lookForTrees = (isVisible, trees, row, col, deltaRow, deltaCol) => {
  let maxHeight = -1;
  const height = trees.length;
  const width = trees[0].length;

  while (row >= 0 && row < height && col >= 0 && col < width) {
    if (trees[row][col] > maxHeight) {
      isVisible[row][col] = true;
      maxHeight = trees[row][col]
    }

    row += deltaRow;
    col += deltaCol;
  }
}

const calcViewDistaince = (trees, row, col, deltaRow, deltaCol) => {
  const currTreeHeight = trees[row][col];
  const height = trees.length;
  const width = trees[0].length;
  let dist = 0;

  while (row > 0 && row < height - 1 && col > 0 && col < width - 1) {
    dist++;
    row += deltaRow;
    col += deltaCol;
    if (trees[row][col] >= currTreeHeight) {
      break;
    }
  }

  return dist;
}

const calcViewScore = (trees, row, col) => {
  const height = trees.length;
  const width = trees[0].length;

  const up = calcViewDistaince(trees, row, col, -1, 0);
  const down = calcViewDistaince(trees, row, col, 1, 0);
  const left = calcViewDistaince(trees, row, col, 0, 1);
  const right = calcViewDistaince(trees, row, col, 0, -1);

  return up * down * left * right;
}

const run = (filename) => {
  const trees = readStringArrayFromFile(filename, "\n").map((line) => {
    return line.split("").map((st) => {
      return parseInt(st);
    });
  });

  // console.log(trees);
  let width = trees[0].length;
  let height = trees.length;
  let isVisible = [...Array(height).keys()].map((row) => {
    return [...Array(width).keys()].map((item) => {
      return false;
    });
  });

  for (let row = 0; row < height; row++) {
    lookForTrees(isVisible, trees, row, 0, 0, 1); // look right
    lookForTrees(isVisible, trees, row, width - 1, 0, -1); // look left
  };

  for (let col = 0; col < width; col++) {
    lookForTrees(isVisible, trees, 0, col, 1, 0); // look down
    lookForTrees(isVisible, trees, height - 1, col, -1, 0); // look up
  };

  let part1 = sum(isVisible.map((row) => {
    return sum(row.map((cell) => { return cell ? 1 : 0 }));
  }));
  console.log(`Part 1: ${part1}`);

  let viewScore = [];
  for (let row = 0; row < height; row++) {
    let rowScores = []
    for (let col = 0; col < width; col++) {
      rowScores.push(calcViewScore(trees, row, col));
    }
    viewScore.push(rowScores);
  }

  let part2 = Math.max(...viewScore.map((row) => {
    return Math.max(...row);
  }));
  console.log(`Part 2: ${part2}`);

}

module.exports = { run };