// https://adventofcode.com/2024/day/4

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const rows = input.split('\n');

type Direction = 'asc' | 'desc' | 'static';

const checkLetter = (rowIndex: number, colIndex: number, value: string) => {
  return rows[rowIndex]?.[colIndex] === value;
}

const getCurrentIndex = (startingIndex: number, diff: number, direction: Direction) => {
  if (direction === 'static') {
    return startingIndex;
  }

  return direction === 'asc' ? startingIndex + diff : startingIndex - diff;
}

const checkWord = ({
  colDirection,
  colIndex,
  rowDirection,
  rowIndex,
  word,
}: {
  colDirection: Direction;
  colIndex: number;
  rowDirection: Direction;
  rowIndex: number;
  word: string;
}): boolean => {
  return word.split('').every((letter, index) => {
    const currentRowIndex = getCurrentIndex(rowIndex, index, rowDirection);
    const currentColIndex = getCurrentIndex(colIndex, index, colDirection);

    return checkLetter(currentRowIndex, currentColIndex, letter);
  })
}

const getCountForPosition = (rowIndex: number, colIndex: number): number => {
  const checker = (rowDirection: Direction, colDirection: Direction) => {
    return checkWord({
      colDirection,
      colIndex,
      rowDirection,
      rowIndex,
      word: 'XMAS',
    });
  }

  return [
    checker('desc', 'desc'),
    checker('desc', 'asc'),
    checker('asc', 'desc'),
    checker('asc', 'asc'),
    checker('desc', 'static'),
    checker('asc', 'static'),
    checker('static', 'asc'),
    checker('static', 'desc'),
  ].filter(Boolean).length;
}

const getCount = (counter: (rowIndex: number, colIndex: number) => number, startingLetter: string): number => {
  let totalCount = 0;

  rows.forEach((row, rowIndex) => {
    const letterIndexes = row
      .split('')
      .map((letter, index) => letter === startingLetter ? index : null)
      .filter(idx => idx !== null);

    letterIndexes.forEach((colIndex) => {
      totalCount += counter(rowIndex, colIndex);
    })
  })

  return totalCount;
}

console.log({ totalCount: getCount(getCountForPosition, 'X') });

const getMaxInXCount = (rowIndex: number, colIndex: number) => {
  const word = 'MAS';

  return [
    // down-right
    checkWord({
      colDirection: 'asc',
      colIndex: colIndex - 1,
      rowDirection: 'asc',
      rowIndex: rowIndex - 1,
      word,
    }),
    // up-right
    checkWord({
      colDirection: 'asc',
      colIndex: colIndex - 1,
      rowDirection: 'desc',
      rowIndex: rowIndex + 1,
      word,
    }),
    // down-left
    checkWord({
      colDirection: 'desc',
      colIndex: colIndex + 1,
      rowDirection: 'asc',
      rowIndex: rowIndex - 1,
      word,
    }),
    // up-left
    checkWord({
      colDirection: 'desc',
      colIndex: colIndex + 1,
      rowDirection: 'desc',
      rowIndex: rowIndex + 1,
      word,
    }),
  ].filter(Boolean).length === 2 ? 1 : 0;
}

console.log({ partTwoTotal: getCount(getMaxInXCount, 'A') })
