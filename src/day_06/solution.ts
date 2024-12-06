// https://adventofcode.com/2024/day/6

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const emptySpot = '.';
const barrier = '#';
const guardUp = '^';
const guardDown = 'v';
const guardRight = '>';
const guardLeft = '<';

const guardChars = [
  guardUp,
  guardDown,
  guardRight,
  guardLeft,
];

let rows: string[][] = [];
let barrierSpots: [rowIndex: number, colIndex: number][] = [];

const buildBarrierSpots = () => {
  barrierSpots = [];

  rows.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col === barrier) {
        barrierSpots.push([rowIndex, colIndex]);
      }
    });
  });
}

const buildRows = () => {
  rows = input.split('\n').filter(Boolean).map(row => row.split(''));

  buildBarrierSpots();
}

buildRows();

type Orientation = 'up' | 'right' | 'down' | 'left';
interface Coords {
  row: number;
  col: number;
  orientation: Orientation;
}

export const range = (start: number, end: number) => {
  return Array(Math.ceil(((end + 1) - start)))
    .fill(start)
    .map((x, y) => x + y);
};

// { [row index]: set of columns }
const travelledSpots: Record<number, Set<number>> = {};

const getOrientation = (char: string): Orientation => {
  switch (char) {
    case guardUp:
      return 'up';
    case guardLeft:
      return 'left';
    case guardDown:
      return 'down';
    case guardRight:
      return 'right';
    default:
      return 'up';
  }
}

const getChar = (orientation: Orientation): string => {
  switch (orientation) {
    case 'up':
      return guardUp;
    case 'left':
      return guardLeft;
    case 'down':
      return guardDown;
    case 'right':
      return guardRight;
  }
}

const getGuardCoords = (): Coords | null => {
  const rowIndex = rows.findIndex((row) => row.some((char) => guardChars.includes(char)));

  if (rowIndex === -1) {
    return null;
  }

  const colIndex = rows[rowIndex].findIndex((char) => guardChars.includes(char));

  const guardChar = rows[rowIndex][colIndex];

  return {
    row: rowIndex,
    col: colIndex,
    orientation: getOrientation(guardChar),
  }
}

const scanForNextAvailableSpot = (coords: Coords): Coords | null => {
  const barriersColsForRow = barrierSpots
    .filter(([rowIndex]) => rowIndex === coords.row)
    .map(([_rowIndex, colIndex]) => colIndex);

  const barriersRowsForCol = barrierSpots
    .filter(([_rowIndex, colIndex]) => colIndex === coords.col)
    .map(([rowIndex]) => rowIndex);

  if (coords.orientation === 'up') {
    const rowIndex = barriersRowsForCol
      .filter((row) => row < coords.row)
      .at(-1);

    // if no rowIndex, the guard can exit the board
    if (rowIndex === undefined) {
      return null;
    }

    return {
      ...coords,
      row: rowIndex + 1,
    }
  }

  if (coords.orientation === 'down') {
    const rowIndex = barriersRowsForCol
      .filter((row) => row > coords.row)
      .at(0);

    // if no rowIndex, the guard can exit the board
    if (rowIndex === undefined) {
      return null;
    }

    return {
      ...coords,
      row: rowIndex - 1,
    }
  }

  if (coords.orientation === 'left') {
    const colIndex = barriersColsForRow
      .filter((col) => col < coords.col)
      .at(-1);

    // if no colIndex, the guard can exit the board
    if (colIndex === undefined) {
      return null;
    }

    return {
      ...coords,
      col: colIndex + 1,
    }
  }

  if (coords.orientation === 'right') {
    const colIndex = barriersColsForRow
      .filter((col) => col > coords.col)
      .at(0);

    // if no colIndex, the guard can exit the board
    if (colIndex === undefined) {
      return null;
    }

    return {
      ...coords,
      col: colIndex - 1,
    }
  }

  return null;
}

const markTravelledSpotsBetweenTwoCoords = (start: Coords, end: Coords) => {
  const isRowSame = start.row === end.row;
  const isColSame = start.col === end.col;

  if (!isRowSame && !isColSame) {
    throw new Error('The guard can only walk in a straight path.');
  }

  if (isRowSame) {
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    const columns = range(minCol, maxCol);

    travelledSpots[start.row] ||= new Set<number>();

    columns.forEach(col => {
      travelledSpots[start.row].add(col)
    });
  }

  if (isColSame) {
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const rows = range(minRow, maxRow);

    rows.forEach((rowIndex) => {
      travelledSpots[rowIndex] ||= new Set<number>();
      travelledSpots[rowIndex].add(start.col);
    });
  }
}

const getNextGuardChar = (char: string) => {
  switch (char) {
    case guardUp:
      return guardRight;
    case guardRight:
      return guardDown;
    case guardDown:
      return guardLeft;
    case guardLeft:
      return guardUp;
    default:
      throw new Error('Guard position not found');
  }
}

const moveGuard = (currentCoords: Coords, destinationCoords: Coords) => {
  rows[destinationCoords.row][destinationCoords.col] = rows[currentCoords.row][currentCoords.col];
  rows[currentCoords.row][currentCoords.col] = emptySpot;
  markTravelledSpotsBetweenTwoCoords(currentCoords, destinationCoords);
}

const walkOffTheBoard = (currentCoords: Coords) => {
  const finalDestination: Coords = {
    ...currentCoords,
  }

  if (currentCoords.orientation === 'up') {
    finalDestination.row = 0;
  }

  if (currentCoords.orientation === 'down') {
    finalDestination.row = rows.length - 1;
  }

  if (currentCoords.orientation === 'left') {
    finalDestination.col = 0;
  }

  if (currentCoords.orientation === 'right') {
    finalDestination.col = rows[0].length - 1;
  }

  markTravelledSpotsBetweenTwoCoords(currentCoords, finalDestination);

  rows[currentCoords.row][currentCoords.col] = emptySpot;
}

const turnGuard = (coords: Coords): Coords => {
  const currentGuardChar = getChar(coords.orientation);
  const nextGuardChar = getNextGuardChar(currentGuardChar);

  rows[coords.row][coords.col] = nextGuardChar;

  return {
    ...coords,
    orientation: getOrientation(nextGuardChar),
  }
}

const walkPath = () => {
  let guardCoords = getGuardCoords();
  const previousCoords: Coords[] = guardCoords ? [guardCoords] : [];
  let hasRepeatedCoords = false;

  while (guardCoords && !hasRepeatedCoords) {
    const nextAvailableSpot = scanForNextAvailableSpot(guardCoords);

    if (nextAvailableSpot) {
      moveGuard(guardCoords, nextAvailableSpot);
      turnGuard(nextAvailableSpot);
    } else {
      walkOffTheBoard(guardCoords);
    }

    guardCoords = getGuardCoords();

    hasRepeatedCoords = previousCoords.some((coords) => {
      return guardCoords?.col === coords?.col &&
        guardCoords?.row === coords?.row &&
        guardCoords?.orientation === coords?.orientation;
    })

    if (guardCoords) {
      previousCoords.push(guardCoords);
    }
  }

  const numberOfSpotsTravelled = Object.values(travelledSpots)
    .reduce((prev, curr) => {
      return prev + curr.size;
    }, 0);

  return {
    isLoop: hasRepeatedCoords,
    numberOfSpotsTravelled,
  }
}

const {
  numberOfSpotsTravelled,
} = walkPath();

console.log({ numberOfSpotsTravelled });

const findPossibleLoopSpots = () => {
  const spotsForInfiniteLoop: [rowIndex: number, colIndex: number][] = [];
  const travelledSpotsValues: [rowIndex: number, colIndex: number][] = [];

  Object.entries(travelledSpots)
    .forEach(([row, colSet]) => {
      const rowIndex = Number(row);

      const cols: number[] = Array.from(colSet);

      const colValues: [rowIndex: number, colIndex: number][] = cols.map((col) => [rowIndex, col]);

      travelledSpotsValues.push(...colValues);
    })

  travelledSpotsValues.forEach(([rowIndex, colIndex], index) => {
    rows[rowIndex][colIndex] = barrier;

    buildBarrierSpots();

    const {
      isLoop,
    } = walkPath();

    const progress = index * 100 / travelledSpotsValues.length;
    console.log({ progress })

    if (isLoop) {
      spotsForInfiniteLoop.push([rowIndex, colIndex]);
    }

    buildRows();
  });

  return { numberOfSpotsForLoop: spotsForInfiniteLoop.length }
}

console.log(findPossibleLoopSpots());
