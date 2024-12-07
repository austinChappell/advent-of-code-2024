// https://adventofcode.com/2024/day/6

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const rows = input.split('\n').filter(Boolean);

type Operator = '+' | '*';

const range = (start: number, end: number): number[] => {
  return Array(Math.ceil(((end + 1) - start)))
    .fill(start)
    .map((x, y) => x + y);
};

const structuredData = rows.map((row) => {
  const [rawResult, rawValues] = row.split(':');
  const values = rawValues.trim().split(' ').map(Number);
  const result = Number(rawResult);

  return {
    result,
    values,
  }
});

const getAllOperatorCombinations = (numberOfOperators: number): Operator[][] => {
  const possibilities: Operator[][] = [];

  const baseOperators: Operator[] = Array(numberOfOperators).fill('*' as Operator)
  const allAddOperators: Operator[] = Array(numberOfOperators).fill('+' as Operator)

  possibilities.push(baseOperators);

  for (let i = 0; i < numberOfOperators - 1; i++) {
    baseOperators.forEach((_, index) => {
      const clonedBased = [...baseOperators];

      const indexesToModifyStart = index;
      const indexesToModifyEnd = index + i;

      const indexesToModify = range(indexesToModifyStart, indexesToModifyEnd)
        .map((idx) => {
          if (baseOperators[idx] === undefined) {
            return idx - baseOperators.length;
          }

          return idx;
        })

      indexesToModify.forEach((idx) => {
        clonedBased[idx] = '+';
      })

      possibilities.push(clonedBased);
    })
  }

  possibilities.push(allAddOperators);

  return possibilities;
}

const canGetResult = ({
  result,
  values,
}: {
  result: number;
  values: number[];
}) => {
  const allOperatorCombos = getAllOperatorCombinations(values.length - 1);

  for (const operatorCombo of allOperatorCombos) {
    const total = values.reduce((prev, curr, index) => {
      if (index === 0) {
        return curr;
      }

      const operator = operatorCombo[index - 1];

      if (operator === '+') {
        return prev + curr;
      }

      return prev * curr;
    }, 0);

    if (total === result) {
      return true;
    }
  }

  return false;
}

const sum = structuredData.reduce((prev, curr) => {
  const hasResultMatch = canGetResult({
    result: curr.result,
    values: curr.values,
  });

  if (hasResultMatch) {
    return prev + curr.result;
  }

  return prev;
}, 0);

console.log({ partOne: sum });

console.log({
  canGetResult: canGetResult({
    result: 1501,
    values: [26, 6, 343, 940, 62],
  })
})
