// https://adventofcode.com/2024/day/5

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const rows = input.split('\n');

const emptyRowIndex = rows.findIndex(r => !r);

const rules = rows
  .slice(0, emptyRowIndex)
  .map(row => row.split('|').map(Number));

const updates = rows
  .slice(emptyRowIndex + 1)
  .map(row => row.split(',').map(Number));

const isUpdateValidForRule = (update: number[], rule: number[]) => {
  let isValid = true;
  let foundMatchingRule = false;

  update.forEach(pageNumber => {
    const ruleIndex = rule.findIndex(v => v === pageNumber);

    if (ruleIndex === 0 && foundMatchingRule) {
      isValid = false;
    }

    if (ruleIndex > -1) {
      foundMatchingRule = true;
    }
  });

  return isValid;
}

const validUpdates = updates.filter(update => {
  return rules.every(rule => isUpdateValidForRule(update, rule))
});

const getMiddleNumberSum = (updatesInput: number[][]): number => {
  return updatesInput.reduce((prev, curr) => {
    const index = (curr.length - 1) / 2;

    return prev + curr[index];
  }, 0)
}

console.log({ middleNumberSumPartOne: getMiddleNumberSum(validUpdates) })

const invalidUpdates = updates.filter(update => {
  return rules.some(rule => !isUpdateValidForRule(update, rule))
});

const reorderUpdateForRule = (update: number[], rule: number[]) => {
  const firstRuleIndex = update.findIndex(v => v === rule[0]);
  const secondRuleIndex = update.findIndex(v => v === rule[1]);

  if (firstRuleIndex === -1 || secondRuleIndex === -1) {
    return;
  }

  if (firstRuleIndex > secondRuleIndex) {
    update.splice(firstRuleIndex, 1);
    update.splice(secondRuleIndex, 0, rule[0]);
  }
}

const stillHasInvalidUpdates = () => {
  return invalidUpdates.some(update => {
    return rules.some(rule => !isUpdateValidForRule(update, rule))
  })
}

const fixInvalidUpdates = () => {
  invalidUpdates.forEach(update => {
    rules.forEach(rule => {
      reorderUpdateForRule(update, rule)
    })
  })
}

while (stillHasInvalidUpdates()) {
  fixInvalidUpdates();
}

console.log({ middleNumberSumPartTwo: getMiddleNumberSum(invalidUpdates) })
