const fs = require("fs");
const { readStringArrayFromFile, sum, min } = require("./lib");

const getCurrDir = (fs, cdStack) => {
  if (!fs) {
    throw new Error("fs is null");
  }

  if (cdStack.length) {
    return getCurrDir(fs.dirs[cdStack[0]], cdStack.slice(1));
  } else {
    return fs;
  }
}

const commandCd = (state, dir) => {
  if (dir == ".") {
    // do nothing
  } else if (dir == "..") {
    state.cdStack.pop();
  } else if (dir == "/") {
    state.cdStack = [];
  } else {
    const currDir = getCurrDir(state.fs, state.cdStack);
    if (!currDir.dirs[dir]) {
      currDir.dirs[dir] = { files: [], dirs: [] }
    }
    state.cdStack.push(dir);
  }
}

const addDir = (state, dirName) => {
  const currDir = getCurrDir(state.fs, state.cdStack);
  if (!currDir.dirs[dirName]) {
    currDir.dirs[dirName] = { files: {}, dirs: {} }
  }
}

const addFile = (state, fileSize, fileName) => {
  const currDir = getCurrDir(state.fs, state.cdStack);
  if (!currDir.files[fileName]) {
    currDir.files[fileName] = fileSize;
  }
}

const processLine = (state, line) => {
  const parts = line.split(" ");
  if (parts[0] == "$") {
    if (parts[1] == "ls") {
      // do nothing
    } else if (parts[1] == "cd") {
      commandCd(state, parts[2]);
    } else {
      console.log(`unknown command: ${line}`);
    }
  } else {
    if (parts[0] == "dir") {
      addDir(state, parts[1]);
    } else {
      addFile(state, parseInt(parts[0]), parts[1]);
    }
  }
}

const getTotalSize = (fs) => {

  let totalSize = 0;
  Object.keys(fs.files).forEach((fileName) => {
    totalSize += fs.files[fileName];
  });

  Object.keys(fs.dirs).forEach((subDirName) => {
    const subDirSize = getTotalSize(fs.dirs[subDirName]);
    totalSize += subDirSize;
  });

  return totalSize;
}

const getFlattenedForSize = (fs, dirName) => {
  const totalSize = getTotalSize(fs);
  let flattened = [{ name: dirName, totalSize }];

  Object.keys(fs.dirs).forEach((subDirName) => {
    const subDirFlat = getFlattenedForSize(fs.dirs[subDirName], `${dirName}/${subDirName}`);
    flattened.push(...subDirFlat);
  });

  return flattened;
}

const calcPart1 = (fs) => {
  const flattened = getFlattenedForSize(fs, "");
  const smallEnough = flattened.filter((dirInfo) => {
    return dirInfo.totalSize <= 100000;
  });
  return sum(smallEnough.map((dirInfo) => { return dirInfo.totalSize; }));
}

const calcPart2 = (fs) => {
  const totalCapacity = 70000000;
  const totalSize = getTotalSize(fs);
  const availableSize = totalCapacity - totalSize;
  const updateSize = 30000000;
  const minimumDeleteNeeded = updateSize - availableSize;

  if (minimumDeleteNeeded < 0) {
    console.log('ALREADY ENOUGH SPACE');
    return 0;
  }

  const flattened = getFlattenedForSize(fs, "");
  const largeEnough = flattened.filter((dirInfo) => {
    return dirInfo.totalSize >= minimumDeleteNeeded;
  });
  const smallest = Math.min(...largeEnough.map((dirInfo) => { return dirInfo.totalSize }));
  return smallest;
}

const run = (filename) => {
  const st = readStringArrayFromFile(filename, "\n");

  let state = {
    cdStack: [],
    fs: { files: {}, dirs: {} }
  }

  for (let i = 0; i < st.length; i++) {
    processLine(state, st[i]);
  }


  console.log(`Part 1: ${calcPart1(state.fs)}`);
  console.log(`Part 2: ${calcPart2(state.fs)}`);

}

module.exports = { run };