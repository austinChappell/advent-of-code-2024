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
}: {
  mapInput: MapInput;
  row: number;
  col: number;
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
    upPath = walkPath({ mapInput, row: upRow, col });
  }

  if (downChar === incrementByOne) {
    downPath = walkPath({ mapInput, row: downRow, col });
  }

  if (leftChar === incrementByOne) {
    leftPath = walkPath({ mapInput, row, col: leftCol });
  }

  if (rightChar === incrementByOne) {
    rightPath = walkPath({ mapInput, row, col: rightCol });
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
}: {
  mapInput: MapInput;
  row: number;
  col: number;
}): {
  totalDestinations: number;
  totalTrails: number;
} => {
  const destinations = walkPath({ mapInput, row, col });

  const destinationSet = new Set<string>();

  destinations.forEach(destination => {
    destinationSet.add(`${destination.row}:${destination.col}`);
  });

  return {
    totalDestinations: destinationSet.size,
    totalTrails: destinations.length,
  }
}

const findTotalHikingPaths = (mapInput: MapInput): {
  totalDestinations: number;
  totalTrails: number;
} => {
  const zeroPositions = findZeros(mapInput);

  return zeroPositions.reduce((prev, curr) => {
    const next = getHikingPathsFromTrailHead({ mapInput, row: curr.row, col: curr.col });

    return {
      totalDestinations: prev.totalDestinations + next.totalDestinations,
      totalTrails: prev.totalTrails + next.totalTrails,
    }
  }, {
    totalDestinations: 0,
    totalTrails: 0,
  });
}

const result = findTotalHikingPaths(mapInput);

console.log({ partOne: result.totalDestinations, partTwo: result.totalTrails })
