const fs = require("fs");

const sum = (arr) => {
  return arr.reduce((tot, curr) => { return (tot + curr) }, 0);
}

const maxIndex = (arr) => {
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i;
    }
  }

  return maxIndex;
}

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result;
}

const powerSet =
  theArray => theArray.reduce(
    (subsets, value) => subsets.concat(
      subsets.map(set => [value, ...set])
    ),
    [[]]
  );

const readStringArrayFromFile = (filename, delim) => {
  return fs.readFileSync(filename).toString().split(delim);
}

const readArrayFromFile = (filename, delim) => {
  return readStringArrayFromFile(filename, delim).map((st) => { return parseInt(st) });
}

const readSingleLineArraysFromFile = (filename) => {
  // lists with one element per line, blank line between separate lists
  return fs.readFileSync(filename).toString().split("\n\n").map((data) => {
    return data.split("\n").map((n) => {
      return parseInt(n);
    });
  });
}

const readListsFromFile = (filename) => {
  const parseLine = (line) => {
    return line.split(",");
  }

  const lines = fs.readFileSync(filename).toString().split("\n");
  return lines.map(parseLine);
}

const parseRecords = (lines, rowInitialFunc, rowAccumulatorFunc) => {
  let records = []
  let currRecord = rowInitialFunc()
  let currRecordStarted = false

  lines.forEach(line => {
    if (line.length > 0) {
      currRecordStarted = true;
      rowAccumulatorFunc(currRecord, line);
    } else {
      records.push(currRecord);
      currRecord = rowInitialFunc();
      currRecordStarted = false;
    }
  })

  if (currRecordStarted) {
    records.push(currRecord);
  }

  return records;
}

module.exports = { sum, maxIndex, permutator, powerSet, readArrayFromFile, readSingleLineArraysFromFile, readStringArrayFromFile, readListsFromFile, parseRecords }