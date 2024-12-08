// https://adventofcode.com/2024/day/8

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const splitData = input.split('\n').filter(Boolean);

const findIndexedPositions = (rows: string[]) => {
  const indexedPositions: Record<string, { col: number; row: number; }[]> = {};

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

const findAntiNodes = (rows: string[], infinite: boolean) => {
  const indexedPositions = findIndexedPositions(rows);

  const minRowBoundary = 0;
  const maxRowBoundary = rows.length - 1;
  const minColBoundary = 0;
  const maxColBoundary = rows[0].length - 1;

  // each value is a string formatted as row:col
  const antiNodes = new Set<string>();

  Object.entries(indexedPositions).forEach(([char, positions]) => {
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

          let leftLimitReached = false;
          let rightLimitReached = false;

          let leftPosition = {
            ...position,
          };
          let rightPosition = {
            ...remainingPosition,
          };

          if (infinite) {
            antiNodes.add(`${leftPosition.row}:${leftPosition.col}`);
            antiNodes.add(`${rightPosition.row}:${rightPosition.col}`);
          }

          while (!leftLimitReached) {
            const newCol = leftPosition.col + colDirection;
            const newRow = leftPosition.row + rowDirection;

            const isOutOfRowBoundary = newRow < minRowBoundary || newRow > maxRowBoundary;
            const isOutOfColBoundary = newCol < minColBoundary || newCol > maxColBoundary;
            const isOutOfBoundary = isOutOfColBoundary || isOutOfRowBoundary;

            if (isOutOfBoundary) {
              leftLimitReached = true;
              break;
            }

            const antiNode = {
              col: newCol,
              row: newRow,
            };

            if (rows[antiNode.row]?.[antiNode.col] === undefined) {
              throw new Error(`Not in grid ${antiNode.row}:${antiNode.col} for char ${char}`);
            }

            antiNodes.add(`${antiNode.row}:${antiNode.col}`);

            leftPosition = {
              ...antiNode,
            }

            if (!infinite) {
              leftLimitReached = true;
            }
          }

          while (!rightLimitReached) {
            const newCol = rightPosition.col - colDirection;
            const newRow = rightPosition.row - rowDirection;

            const isOutOfRowBoundary = newRow < minRowBoundary || newRow > maxRowBoundary;
            const isOutOfColBoundary = newCol < minColBoundary || newCol > maxColBoundary;
            const isOutOfBoundary = isOutOfColBoundary || isOutOfRowBoundary;

            if (isOutOfBoundary) {
              rightLimitReached = true;
              break;
            }

            const antiNode = {
              col: newCol,
              row: newRow,
            };

            if (rows[antiNode.row]?.[antiNode.col] === undefined) {
              throw new Error(`Not in grid ${antiNode.row}:${antiNode.col} for char ${char}`);
            }

            antiNodes.add(`${antiNode.row}:${antiNode.col}`);

            rightPosition = {
              ...antiNode,
            }

            if (!infinite) {
              rightLimitReached = true;
            }
          }
        })
      }
    })
  })

  return antiNodes;
}

console.log({ partOne: findAntiNodes(splitData, false).size });
console.log({ partTwo: findAntiNodes(splitData, true).size });

// console.log(Array.from(findAntiNodes(splitData, true)).sort((a, b) => a.localeCompare(b)))
