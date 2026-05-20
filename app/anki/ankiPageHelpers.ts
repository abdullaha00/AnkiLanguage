export function addKnownTokens(
  tokenizer: any,
  source: any,
  s2: Set<any>,
  textArray: any[],
  logTokens = false,
) {
  var tokens = tokenizer.tokenize(source);
  if (logTokens) console.log(tokens);
  tokens.forEach((token: any) => {
    if (
      token["word_type"] == "KNOWN" &&
      token["pos_detail_2"] != "人名" &&
      token["pos"] != "記号" &&
      token["pos"] != "一般"
    ) {
      s2.add(token["basic_form"]);
      textArray.push(token["basic_form"]);

      if (token["basic_form"] == "後藤") console.log(token);
    }
  });
}

export function getKnownWordComparison(
  vocabArr: string[],
  s2: Set<any>,
  textArray: any[],
) {
  const s3 = new Set();
  const intersectionArray = new Array();

  const countU: { [key: string]: number } = {};

  for (let w of vocabArr) {
    if (s2.has(w)) {
      s3.add(w);
    }
  }

  let x = 0;

  for (let w of textArray) {
    if (vocabArr.includes(w)) {
      x++;
    } else {
      if (countU[w]) {
        countU[w]++;
      } else {
        countU[w] = 1;
      }
    }
  }

  const countUA = Object.entries(countU);
  countUA.sort((a, b) => a[1] - b[1]).reverse();

  return { s3, intersectionArray, countU, countUA, x };
}
