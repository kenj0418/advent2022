const fs = require("fs");
const { readStringArrayFromFile, sum } = require("./lib");

const compareArray = (l1, l2) => {
  console.log(`compareArray ${JSON.stringify(l1)} and ${JSON.stringify(l2)}`);
  let i = 0;

  while (i < l1.length && i < l2.length) {
    let comp = compare(l1[i], l2[i]);
    if (comp != 0) {
      return comp;
    } else {
      i++
    }
  }

  if (i >= l1.length) {
    return -1;
  } else if (i >= l2.length) {
    return 1;
  } else {
    return 0;
  }
};

const compare = (o1, o2) => {
  console.log(`comparing ${JSON.stringify(o1)} and ${JSON.stringify(o2)}`);
  if (Array.isArray(o1) && Array.isArray(o2)) {
    return compareArray(o1, o2);
  } else if (Array.isArray(o1)) {
    return compareArray(o1, [o2]);
  } else if (Array.isArray(o2)) {
    return compareArray([o1], o2);
  } else {
    console.log(`result: ${o1 - o2}`);
    return o1 - o2;
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
      tokens.push(parseInt(match[1]));
    } else {
      tokens.push(match[1]);
    }
    remaining = match[2];
  }

  return tokens;
}


const parse = (tokens) => {
  // console.log(`parse: ${JSON.stringify(tokens)}`);

  if (tokens[0] == ']') {
    return "wat"
  }
  if (tokens[0] != '[') {
    return tokens[0]; // expr:= #
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
      // console.log(`num ${numParens} value=${token}`);
    }
  })

  // [1,[2,[3,[4,[5,6,7]]]],8,9]
  // [3]
  // [[[]]]
  // [1,2,5,1,1]

  return parsed;
}

const run = (filename) => {
  const packets = readStringArrayFromFile(filename, "\n\n").map((data) => {
    return data.split("\n").map(tokenize);
  });

  // console.log(JSON.stringify(parse(tokenize('[1,[2,[3,[4,[5,6,7]]]],8,9]'))));
  // console.log(JSON.stringify(parse(tokenize('[3]'))));
  // console.log(JSON.stringify(parse(tokenize('[[[]]]'))));
  // console.log(JSON.stringify(parse(tokenize('[1,2,3,4,5]'))));

  let sumIndexes = 0;
  for (let i = 0; i < packets.length; i++) {
    const cmp = compare(parse(packets[i][0]), parse(packets[i][1]));
    console.log(`RESULT @ ${i + 1}: ${cmp}`);
    if (cmp < 0) {
      // console.log(`valid @${i} ${cmp}: ${JSON.stringify(packets[i][0])} AND ${JSON.stringify(packets[i][1])}`);
      sumIndexes += i + 1;
    }
  }

  console.log(`Part 1: ${sumIndexes}`);
  console.log(`Part 2: ${0}`);
}

module.exports = { run };

// part 1 too high: 5876
