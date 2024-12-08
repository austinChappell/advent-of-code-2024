// https://adventofcode.com/2024/day/8

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const splitData = input.split('\n').filter(Boolean);

interface Position {
  row: number;
  col: number;
}

const formatAntiNode = (position: Position) => {
  return `${position.row}:${position.col}`;
}

const findIndexedPositions = (rows: string[]) => {
  const indexedPositions: Record<string, Position[]> = {};

  rows.forEach((row, rowIndex) => {
    row.split('').forEach((col, colIndex) => {
      if (col !== '.') {
        indexedPositions[col] ||= [];
        indexedPositions[col].push({ col: colIndex, row: rowIndex });
      }
    });
  });

  return indexedPositions;
}

const buildAntiNodes = ({
  colDirection,
  initialPosition,
  infinite,
  numberOfCols,
  numberOfRows,
  rowDirection,
}: {
  colDirection: number;
  initialPosition: Position;
  infinite: boolean;
  numberOfCols: number;
  numberOfRows: number;
  rowDirection: number;
}) => {
  const antiNodes: Position[] = [];

  if (infinite) {
    antiNodes.push(initialPosition);
  }

  const minRowBoundary = 0;
  const maxRowBoundary = numberOfRows - 1;
  const minColBoundary = 0;
  const maxColBoundary = numberOfCols - 1;

  let limitReached = false;
  let position = {
    ...initialPosition,
  }

  while (!limitReached) {
    const newCol = position.col + colDirection;
    const newRow = position.row + rowDirection;

    const isOutOfRowBoundary = newRow < minRowBoundary || newRow > maxRowBoundary;
    const isOutOfColBoundary = newCol < minColBoundary || newCol > maxColBoundary;
    const isOutOfBoundary = isOutOfColBoundary || isOutOfRowBoundary;

    if (isOutOfBoundary) {
      limitReached = true;
      break;
    }

    const antiNode = {
      col: newCol,
      row: newRow,
    };

    antiNodes.push(antiNode);

    position = {
      ...antiNode,
    }

    if (!infinite) {
      limitReached = true;
    }
  }

  return antiNodes;
}

const findAntiNodes = (rows: string[], infinite: boolean) => {
  const indexedPositions = findIndexedPositions(rows);

  // each value is a string formatted as row:col
  const antiNodes = new Set<string>();

  Object.entries(indexedPositions).forEach(([_char, positions]) => {
    positions.forEach((position, index) => {
      if (index < positions.length - 1) {
        const remaining = positions.slice(index + 1);

        remaining.forEach((remainingPosition) => {
          const rowDiff = Math.abs(position.row - remainingPosition.row);
          const colDiff = Math.abs(position.col - remainingPosition.col);

          const isPositionLesserRow = position.row <= remainingPosition.row;
          const isPositionLesserCol = position.col <= remainingPosition.col;

          const rowDirection = isPositionLesserRow ? rowDiff * -1 : rowDiff;
          const colDirection = isPositionLesserCol ? colDiff * -1 : colDiff;

          const descendingAntiNodes = buildAntiNodes({
            colDirection,
            infinite,
            initialPosition: position,
            numberOfCols: rows[0].length,
            numberOfRows: rows.length,
            rowDirection,
          });

          const ascendingAntiNodes = buildAntiNodes({
            colDirection: colDirection * -1,
            infinite,
            initialPosition: remainingPosition,
            numberOfCols: rows[0].length,
            numberOfRows: rows.length,
            rowDirection: rowDirection * -1,
          });

          [...descendingAntiNodes, ...ascendingAntiNodes].forEach((antiNode) => {
            antiNodes.add(formatAntiNode(antiNode));
          });
        })
      }
    })
  })

  return antiNodes;
}

console.log({ partOne: findAntiNodes(splitData, false).size });
console.log({ partTwo: findAntiNodes(splitData, true).size });
