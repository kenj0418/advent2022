const fs = require("fs");
const { readStringArrayFromFile } = require("./lib");

const compare = (o1, o2) => {
  console.log(`comparing ${JSON.stringify(o1)} and ${JSON.stringify(o2)}`);
  const l1 = Array.isArray(o1) ? o1 : [o1];
  const l2 = Array.isArray(o2) ? o2 : [o2];

  let i = 0;
  while (i < l1.length && i < l2.length) {
    let comp;

    if (!Array.isArray(l1[i]) && !Array.isArray(l2[i])) {
      comp = l1[i] - l2[i];
      console.log(`@${i + 1} comp (int) ${comp}`);
    } else {
      comp = compare(l1[i], l2[i]);
      console.log(`@${i + 1} comp (list) ${comp}`);
    }

    if (comp != 0) {
      return comp;
    } else {
      i++
    }
  }

  console.log(`lengths: i: ${i + 1} l1: ${l1.length} l2: ${l2.length}`);

  if (i >= l1.length && i >= l2.length) {
    return 0;
  } else if (i >= l1.length) {
    return -1;
  } else if (i >= l2.length) {
    return 1;
  } else {
    throw new Error("how did we get here?");
  }
}

const tokenize = (st) => {
  let tokens = [];
  let remaining = st;

  while (remaining) {
    const match = remaining.match(/^([0-9]+|,|\[|\])(.*)$/)
    if (!match) {
      throw new Error(`Unable to parse remainder: ${remaining}`);
    }
    if (match[1].match(/[0-9]+/)) {
      const intValue = parseInt(match[1]);
      tokens.push(intValue ? intValue : -1); // since zero seems to be causing issues
    } else {
      tokens.push(match[1]);
    }
    remaining = match[2];
  }

  return tokens;
}


const parse = (tokens) => {
  if (tokens[0] == ']') {
    return "wat"
  }
  if (tokens[0] != '[') {
    return tokens[0];
  }

  let parsed = [];
  let currTokens = [];
  let numParens = 0;
  tokens.forEach((token) => {
    if (token == '[') {
      if (numParens > 0) {
        currTokens.push(token);
      }
      numParens++;
    } else if (token == ']') {
      numParens--;
      if (numParens == 0) {
        const p = parse(currTokens);
        if (p) {
          parsed.push(p);
        }
        currTokens = [];
      } else {
        currTokens.push(token);
      }
    } else if (token == ',') {
      if (numParens == 1) {
        parsed.push(parse(currTokens));
        currTokens = [];
      } else {
        currTokens.push(token);
      }
    } else {
      currTokens.push(token);
    }
  })

  return parsed;
}

const run = (filename) => {
  const packets = readStringArrayFromFile(filename, "\n\n").map((data) => {
    return data.split("\n").map(tokenize);
  });

  let sumIndexes = 0;
  for (let i = 0; i < packets.length; i++) {
    const cmp = compare(parse(packets[i][0]), parse(packets[i][1]));
    console.log(`RESULT @ ${i + 1}: ${cmp} ${cmp < 0 ? "ADDING" : ""}\n`);
    if (cmp < 0) {
      sumIndexes += i + 1;
    }
  }

  console.log(`Part 1: ${sumIndexes}`);
  console.log(`Part 2: ${0}`);
}

module.exports = { run };

// part 1 too high: 5876
// part 1 too low:  5390 (but right answer for someone)
// fuck, back at 5876
// part 1 finally: 5843
