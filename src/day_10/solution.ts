// https://adventofcode.com/2024/day/10

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

type MapInput = number[][];
interface Position {
  row: number;
  col: number;
}

const mapInput = input.split('\n').filter(Boolean).map(row => row.split('').map(Number));

const findZeros = (mapInput: MapInput): Position[] => {
  return mapInput.flatMap((row, rowIndex) => {
    return row.flatMap((col, colIndex) => {
      if (col === 0) {
        return {
          row: rowIndex,
          col: colIndex,
        }
      }

      return null;
    }).filter(Boolean) as Position[];
  })
}

const getChar = ({
  mapInput,
  row,
  col,
}: {
  mapInput: MapInput;
  row: number;
  col: number;
}): number | null => {
  return mapInput[row]?.[col] ?? null;
}

const walkPath = ({
  mapInput,
  row,
  col,
  withLog,
  details,
}: {
  mapInput: MapInput;
  row: number;
  col: number;
  withLog?: boolean;
  details: string;
}): Position[] => {
  const upRow = row - 1;
  const downRow = row + 1;
  const leftCol = col - 1;
  const rightCol = col + 1;
  const start = getChar({ mapInput, row, col });

  let upChar = getChar({ mapInput, row: upRow, col });
  let downChar = getChar({ mapInput, row: downRow, col });
  let leftChar = getChar({ mapInput, row, col: leftCol });
  let rightChar = getChar({ mapInput, row, col: rightCol });
  let upPathCount = 0;
  let downPathCount = 0;
  let leftPathCount = 0;
  let rightPathCount = 0;
  let nineCount = 0;
  let upPath: Position[] = [];
  let downPath: Position[] = [];
  let leftPath: Position[] = [];
  let rightPath: Position[] = [];

  if (start === null) {
    return [];
  }

  if (start === 9) {
    return [{ row, col }]
  }

  const incrementByOne = start + 1;

  if (upChar === incrementByOne) {
    upPath = walkPath({ mapInput, row: upRow, col, withLog, details: 'up path' });
  }

  if (downChar === incrementByOne) {
    downPath = walkPath({ mapInput, row: downRow, col, withLog, details: 'down path' });
  }

  if (leftChar === incrementByOne) {
    leftPath = walkPath({ mapInput, row, col: leftCol, withLog, details: 'left path' });
  }

  if (rightChar === incrementByOne) {
    rightPath = walkPath({ mapInput, row, col: rightCol, withLog, details: 'right path' });
  }

  if (withLog) {
    console.log({
      details,
      start,
      row,
      col,
      incrementByOne,
      upChar,
      downChar,
      leftChar,
      rightCol,
      upPathCount,
      downPathCount,
      leftPathCount,
      rightPathCount,
      nineCount,
    })
  }

  return [
    ...upPath,
    ...downPath,
    ...leftPath,
    ...rightPath,
  ];
}

const getHikingPathsFromTrailHead = ({
  mapInput,
  row,
  col,
  withLog,
}: {
  mapInput: MapInput;
  row: number;
  col: number;
  withLog?: boolean;
}): number => {
  const startingChar = getChar({ mapInput, row, col });

  if (startingChar !== 0) {
    return 0;
  }

  const destinations = walkPath({ mapInput, row, col, withLog, details: 'start' });

  const destinationSet = new Set<string>();

  destinations.forEach(destination => {
    destinationSet.add(`${destination.row}:${destination.col}`);
  });

  return destinationSet.size;
}

const findTotalHikingPaths = (mapInput: MapInput): number => {
  const zeroPositions = findZeros(mapInput);

  return zeroPositions.reduce((prev, curr) => {
    return prev + getHikingPathsFromTrailHead({ mapInput, row: curr.row, col: curr.col });
  }, 0);
}

console.log({ partOne: findTotalHikingPaths(mapInput) })
