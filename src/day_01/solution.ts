import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const lines = input.split('\n');

const mappedLines = lines.map((line) => {
  return line.split(' ').filter(Boolean).map(Number)
})

const firstDataSet = mappedLines.map((line) => line[0])
const secondDataSet = mappedLines.map((line) => line[1])

firstDataSet.sort();
secondDataSet.sort();

const diff = firstDataSet.reduce((prev, curr, index) => {
  const secondValue = secondDataSet[index];

  return prev + Math.abs(curr - secondValue);
}, 0);

console.log({ diff })

const similarity = firstDataSet.reduce((prev, curr, index) => {
  const occurrencesInSecondSet = secondDataSet.filter((n) => n === curr).length;

  return prev + curr * occurrencesInSecondSet;
}, 0);

console.log({ similarity })
