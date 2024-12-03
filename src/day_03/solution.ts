// https://adventofcode.com/2024/day/3

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const getProduct = (data: string) => {
  const multipliers = data.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/gm) ?? [];

  return multipliers.reduce((prev, curr) => {
    let [firstNumber, secondNumber] = curr.split(',');
    firstNumber = firstNumber.split('mul(')[1];
    secondNumber = secondNumber.split(')')[0];

    const product = Number(firstNumber) * Number(secondNumber);

    return prev + product;
  }, 0);
}

console.log({ multiplicationSum: getProduct(input) });

const validStatements: string[] = [];

let hasDo = true;
let hasDont = true;

let modifiableInput = input;

while (hasDo || hasDont) {
  const doIndex = modifiableInput.lastIndexOf('do()');
  const dontIndex = modifiableInput.lastIndexOf("don't()");

  hasDo = doIndex !== -1;
  hasDont = dontIndex !== -1;

  if (doIndex >= dontIndex) {
    const indexToSlice = doIndex > -1 ? doIndex : 0;

    validStatements.push(modifiableInput.slice(indexToSlice))
  }

  modifiableInput = modifiableInput.slice(0, Math.max(doIndex, dontIndex))
}

const sumOfValidStatements = validStatements.reduce((prev, curr) => {
  return prev + getProduct(curr);
}, 0);

console.log({ sumOfValidStatements })
