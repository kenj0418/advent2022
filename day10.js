const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const step = (sys) => {
  const instr = sys.prog[sys.pc];
  sys.pc++;

  // console.log(`@ ${sys.clock} : ${instr[0]} ${instr[1]}`);

  switch (instr[0]) {
    case 'noop':
      sys.clock += 1;
      sys.valuesAt[sys.clock] = { x: sys.x };
      break;

    case 'addx':
      sys.clock += 1;
      sys.valuesAt[sys.clock] = { x: sys.x };
      sys.clock += 1;
      sys.x += instr[1];
      sys.valuesAt[sys.clock] = { x: sys.x };
      break;

    default:
      throw new Error(`Unknown instruction ${instr[0]}`);
  }
}

const run = (filename) => {
  const prog = readStringArrayFromFile(filename, "\n").map((line) => {
    const parts = line.split(" ");
    return [parts[0], parseInt(parts[1])];
  });

  const sys = {
    x: 1,
    pc: 0,
    prog,
    clock: 1,
    valuesAt: [{ x: 1 }]
  }

  const stopAt = 225;
  while (sys.clock < stopAt) {
    step(sys);
  }

  const breakPoints = [20, 60, 100, 140, 180, 220];
  const values = breakPoints.map((bp) => { return sys.valuesAt[bp].x * bp; });
  const part1 = sum(values);

  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${0}`);

}

module.exports = { run };