// https://adventofcode.com/2024/day/14

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const lines = input.split('\n').filter(Boolean);

const movePiece = ({
  gridHeight,
  gridWidth,
  numberOfTimes,
  startX,
  startY,
  velocityX,
  velocityY,
}: {
  gridHeight: number;
  gridWidth: number;
  numberOfTimes: number;
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
}) => {
  const xMoveTotal = velocityX * numberOfTimes;
  const yMoveTotal = velocityY * numberOfTimes;

  const newX = startX + xMoveTotal;
  const newY = startY + yMoveTotal;

  const xModulo = newX % gridWidth;
  const yModulo = newY % gridHeight;

  const x = xModulo >= 0 ? xModulo : gridWidth + xModulo;
  const y = yModulo >= 0 ? yModulo : gridHeight + yModulo;

  return {
    x,
    y,
  }
}

const getQuadrant = ({
  height,
  width,
  x,
  y,
}: {
  height: number;
  width: number;
  x: number;
  y: number;
}): number | null => {
  const halfWidth = (width - 1) / 2;
  const halfHeight = (height - 1) / 2;

  const isTopHalf = y < halfHeight;
  const isBottomHalf = y > halfHeight;
  const isLeftHalf = x < halfWidth;
  const isRightHalf = x > halfWidth;

  if (isTopHalf && isRightHalf) {
    return 1;
  }

  if (isBottomHalf && isRightHalf) {
    return 2;
  }

  if (isBottomHalf && isLeftHalf) {
    return 3;
  }

  if (isTopHalf && isLeftHalf) {
    return 4;
  }

  return null;
}

const getProduct = (gridHeight: number, gridWidth: number): number => {
  const movedPieces = lines.map((line) => {
    const [start, velocity] = line.split(' ');
    const { 1: startNumbers } = start.split('=');
    const { 1: velocityNumbers } = velocity.split('=');

    const [startX, startY] = startNumbers.split(',').map(Number);
    const [velocityX, velocityY] = velocityNumbers.split(',').map(Number);

    return movePiece({
      gridHeight,
      gridWidth,
      numberOfTimes: 100,
      startX,
      startY,
      velocityX,
      velocityY,
    });
  });

  const quadrantCounts = movedPieces.reduce((prev, curr) => {
    const quadrant = getQuadrant({
      height: gridHeight,
      width: gridWidth,
      x: curr.x,
      y: curr.y,
    });

    if (quadrant !== null) {
      prev[quadrant - 1] += 1;
    }

    return prev;
  }, [0,0,0,0] as [number, number, number, number]);

  return quadrantCounts[0] * quadrantCounts[1] * quadrantCounts[2] * quadrantCounts[3];
}

console.log({
  // partOne: getProduct(11, 7),
  partOne: getProduct(103, 101),
})
