const fs = require("fs");
const { readStringArrayFromFile } = require("./lib");

const parseBoxes = (st) => {
  let boxes = [];
  for (let i = 0; i < 10; i++) {
    boxes[i] = [];
  }

  const lines = st.split("\n");
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    for (let j = 1; j < 10; j++) {
      const stIndex = -3 + 4 * j;
      const box = line.slice(stIndex, stIndex + 1);
      if (box && box != " ") {
        boxes[j].unshift(box);
      }
    }
  }

  return boxes;
}

const moveBox = (boxes, from, to) => {
  const temp = boxes[from].pop();
  if (temp) {
    boxes[to].push(temp);
  }
}

const performStep1 = (boxes, step) => {
  for (let i = 0; i < step.n; i++) {
    moveBox(boxes, step.from, step.to);
  }
}

const performStep2 = (boxes, step) => {
  let tempStack = []
  for (let i = 0; i < step.n; i++) {
    let tempBox = boxes[step.from].pop();
    tempStack.unshift(tempBox);
  }

  boxes[step.to] = boxes[step.to].concat(tempStack);
}

const getMessage = (boxes) => {
  return boxes.slice(1).map((box) => {
    return box[box.length - 1];
  }).join("");
}

const run = () => {
  const parts = readStringArrayFromFile("./input/day5.txt", "\n\n");
  let boxes = parseBoxes(parts[0]);
  const steps = parts[1].split("\n").map((st) => {
    const stParts = st.split(" ");
    return {
      n: parseInt(stParts[1]),
      from: parseInt(stParts[3]),
      to: parseInt(stParts[5]),
    };
  });

  for (let i = 0; i < steps.length; i++) {
    performStep2(boxes, steps[i]);
  }

  console.log(`result: ${getMessage(boxes)}`);
}

module.exports = { run };