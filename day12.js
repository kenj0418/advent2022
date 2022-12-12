const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const isMovable = (elevations, rowIndex, colIndex, adjRowIndex, adjColIndex) => {
  let currHeight = elevations[rowIndex][colIndex];
  let nextHeight = elevations[adjRowIndex][adjColIndex];
  return nextHeight + 1 >= currHeight;
}

const updateAdjacentDistances = (elevations, distances, rowIndex, colIndex, adjRowIndex, adjColIndex) => {
  if (adjRowIndex < 0 || adjColIndex < 0 || adjRowIndex >= elevations.length || adjColIndex >= elevations[0].length) {
    return
  } else if (distances[adjRowIndex][adjColIndex]) {
    return
  }

  if (isMovable(elevations, rowIndex, colIndex, adjRowIndex, adjColIndex)) {
    distances[adjRowIndex][adjColIndex] = distances[rowIndex][colIndex] + 1;
  }
}

const updateDistances = (elevations, distances) => {
  for (let rowIndex = 0; rowIndex < elevations.length; rowIndex++) {
    for (let colIndex = 0; colIndex < elevations[0].length; colIndex++) {
      if (distances[rowIndex][colIndex]) {
        updateAdjacentDistances(elevations, distances, rowIndex, colIndex, rowIndex + 1, colIndex);
        updateAdjacentDistances(elevations, distances, rowIndex, colIndex, rowIndex - 1, colIndex);
        updateAdjacentDistances(elevations, distances, rowIndex, colIndex, rowIndex, colIndex + 1);
        updateAdjacentDistances(elevations, distances, rowIndex, colIndex, rowIndex, colIndex - 1);
      }
    }
  }
}

const dump = (dist) => {
  return dist.map((row) => {
    return row.map((cell) => { return ("000" + cell).slice(-3) }).join(" ")
  });
}

const run = (filename) => {
  let startRow = -1;
  let startCol = -1;
  let endRow = -1;
  let endCol = -1;
  const startHeight = 'a'.charCodeAt(0);
  const endHeight = 'z'.charCodeAt(0);
  const elevations = readStringArrayFromFile(filename, "\n").map((line, rowIndex) => {
    return line.split("").map((cell, colIndex) => {
      if (cell == 'S') {
        startRow = rowIndex;
        startCol = colIndex;
        return startHeight;
      } else if (cell == 'E') {
        endRow = rowIndex;
        endCol = colIndex;
        return endHeight;
      } else {
        return cell.charCodeAt(0);
      };
    })
  });

  const distances = elevations.map((row) => {
    return row.map(() => {
      return 0;
    })
  })
  distances[endRow][endCol] = 1;

  while (!distances[startRow][startCol]) {
    updateDistances(elevations, distances);
  }
  const part1 = distances[startRow][startCol] - 1;
  console.log(`Part 1: ${part1}`);

  let minTrailDist = 9999;
  for (let row = 0; row < distances.length; row++) {
    for (let col = 0; col < distances[0].length; col++) {
      if (elevations[row][col] == startHeight && distances[row][col] && distances[row][col] < minTrailDist) {
        minTrailDist = distances[row][col];
      }
    }
  }

  console.log(`Part 2: ${minTrailDist - 1}`);
}

module.exports = { run };