// https://adventofcode.com/2024/day/7

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const rows = input.split('\n').filter(Boolean);

const structuredData = rows.map((row) => {
  const [rawResult, rawValues] = row.split(':');
  const values = rawValues.trim().split(' ').map(Number);
  const result = Number(rawResult);

  return {
    result,
    values,
  }
});

function repeatedPermutation<T>(arr: T[], length: number) {
  if (length === 1) return arr.map(item => [item]);

  const perms: T[][] = [];
  const smallerPerms = repeatedPermutation(arr, length - 1);

  for (const smallerPerm of smallerPerms) {
    for (const item of arr) {
      perms.push([...smallerPerm, item]);
    }
  }

  return perms;
}

const canGetResult = ({
  operators,
  result,
  values,
}: {
  operators: string[];
  result: number;
  values: number[];
}) => {
  const allOperatorCombos = repeatedPermutation(operators, values.length - 1);

  for (const operatorCombo of allOperatorCombos) {
    const total = values.reduce((prev, curr, index) => {
      if (index === 0) {
        return curr;
      }

      const operator = operatorCombo[index - 1];

      if (operator === '+') {
        return prev + curr;
      }

      if (operator === '*') {
       return prev * curr;
      }

      if (operator === '||') {
        return Number(`${prev}${curr}`)
      }

      return prev;
    }, 0);

    if (total === result) {
      return true;
    }
  }

  return false;
}

const partOneSum = structuredData
  .filter((curr) => canGetResult({...curr, operators: ['+', '*']}))
  .reduce((prev, curr) => prev + curr.result, 0);

console.log({ partOneSum });

const partTwoSum = structuredData
  .filter((curr) => canGetResult({...curr, operators: ['+', '*', '||']}))
  .reduce((prev, curr) => prev + curr.result, 0);

console.log({ partTwoSum });
