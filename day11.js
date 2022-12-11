const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const moduloValue = BigInt(6469693230); // product of first 10 primes

const parseItems = (st) => {
  return st.split(", ").map((numSt) => { return BigInt(numSt) });
}

const parseMonkey = (st) => {
  const parts = st.split("\n");
  const monkeyNumMatch = parts[0].match(/Monkey (\d+):/);
  const startItemsMatch = parts[1].match(/Starting items: (.+)/);
  const operationMatch = parts[2].match(/Operation: new = ([a-zA-Z0-9]+) (.) ([a-zA-Z0-9]+)/);
  const testMatch = parts[3].match(/Test: divisible by (\d+)/);
  const trueMatch = parts[4].match(/If true: throw to monkey (\d+)/);
  const falseMatch = parts[5].match(/If false: throw to monkey (\d+)/);

  if (!monkeyNumMatch || !startItemsMatch || !operationMatch || !testMatch || !trueMatch || !falseMatch) {
    throw new Error(`Error parsing: ${st}`);
  }

  return {
    id: parseInt(monkeyNumMatch[1]),
    items: parseItems(startItemsMatch[1]),
    op1: operationMatch[1],
    operation: operationMatch[2],
    op2: operationMatch[3],
    test: BigInt(testMatch[1]),
    trueTarget: parseInt(trueMatch[1]),
    falseTarget: parseInt(falseMatch[1]),
    numInspected: 0,
  }
  /*
  Monkey 0:
  Starting items: 74, 64, 74, 63, 53
  Operation: new = old * 7
  Test: divisible by 5
    If true: throw to monkey 1
    If false: throw to monkey 6
  */
}

const parseMonkeys = (monkeyStrings) => {
  return monkeyStrings.map(parseMonkey);
}

const getOperand = (op, oldValue) => {
  if (op == "old") {
    return oldValue;
  } else {
    return BigInt(op);
  }
}

const performOperation = (operation, op1, op2) => {
  switch (operation) {
    case '+': return op1 + op2;
    case '*': return op1 * op2;
    default: throw new Error(`Unknown operation: ${operation}`);
  }
}

const processItem = (monkeys, monkey, item, worryDecayEnabled) => {
  // do inspection (operation)
  const operand1 = getOperand(monkey.op1, item);
  const operand2 = getOperand(monkey.op2, item);
  let newWorry = performOperation(monkey.operation, operand1, operand2);
  monkey.numInspected++;

  // do worry decay
  if (worryDecayEnabled) {
    newWorry = newWorry / BigInt(3);
  } else {
    newWorry = newWorry % moduloValue; // since even BigInt has a limit (plus gets slow)
  }

  // do test and toss
  if (newWorry % monkey.test == 0) {
    monkeys[monkey.trueTarget].items.push(newWorry);
  } else {
    monkeys[monkey.falseTarget].items.push(newWorry);
  }
}

const processMonkey = (monkeys, index, worryDecayEnabled) => {
  const monkey = monkeys[index];

  while (monkey.items.length) {
    const item = monkey.items.shift();
    processItem(monkeys, monkey, item, worryDecayEnabled);
  }
}

const doRound = (monkeys, worryDecayEnabled) => {
  for (let i = 0; i < monkeys.length; i++) {
    processMonkey(monkeys, i, worryDecayEnabled);
  }
}

const run1 = (filename) => {
  const monkeyStrings = readStringArrayFromFile(filename, "\n\n");
  const monkeys = parseMonkeys(monkeyStrings);

  for (let i = 0; i < 20; i++) {
    doRound(monkeys, true);
  }

  const numInspections = monkeys.map((monkey) => { return monkey.numInspected });
  numInspections.sort((a, b) => { return b - a });
  const monkeyBusinessPart1 = numInspections[0] * numInspections[1];

  console.log(`Part 1: ${monkeyBusinessPart1}`);

}

const run2 = (filename) => {
  const monkeyStrings = readStringArrayFromFile(filename, "\n\n");
  const monkeys = parseMonkeys(monkeyStrings);

  for (let i = 0; i < 10000; i++) {
    // if (i == 1 || i == 20 || i % 1000 == 0) {
    //   const numInspections = monkeys.map((monkey) => { return monkey.numInspected });
    //   console.log(`${i}: ${numInspections}`);
    // }
    doRound(monkeys, false);
  }

  const numInspections = monkeys.map((monkey) => { return monkey.numInspected });
  numInspections.sort((a, b) => { return b - a });
  const monkeyBusinessPart2 = numInspections[0] * numInspections[1];

  console.log(`Part 2: ${monkeyBusinessPart2}`);

}

const run = (filename) => {
  run1(filename);
  run2(filename);
}

module.exports = { run };