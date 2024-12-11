// https://adventofcode.com/2024/day/11

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const splitInput = input.split(' ').map(Number);

const cache: Record<string, number> = {};

const buildCacheKey = (stone: number, blinks: number) => `${stone}:${blinks}`;

const getCount = (stone: number, blinks: number): number => {
  const getStoneCount = (stone: number, blinksRemaining: number, runningCount: number): number => {
    const cacheKey = buildCacheKey(stone, blinksRemaining);

    const cachedValue = cache[cacheKey];

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    if (blinksRemaining === 0) {
      return 1;
    }

    if (stone === 0) {
      const value = 1;

      const newCount = getStoneCount(value, blinksRemaining - 1, runningCount);

      cache[cacheKey] = newCount;

      return newCount + runningCount;
    }

    const stoneString = stone.toString();

    if (stoneString.length % 2 === 0) {
      // we make sure we strip leading 0s
      const values = [
        Number(stoneString.slice(0, stoneString.length / 2)),
        Number(stoneString.slice(stoneString.length / 2)),
      ];

      const firstCount = getStoneCount(values[0], blinksRemaining - 1, runningCount);
      const secondCount = getStoneCount(values[1], blinksRemaining - 1, runningCount);

      const newCount = firstCount + secondCount;

      cache[cacheKey] = newCount;

      return newCount + runningCount;
    }

    const value = (Number(stone) * 2024);

    const newCount = getStoneCount(value, blinksRemaining - 1, runningCount);

    cache[cacheKey] = newCount;

    return newCount + runningCount;
  }

  return getStoneCount(stone, blinks, 0);
}

const countStones = (stones: number[], blinks: number) => {
  return stones.reduce((prev, curr) => {
    const newCount = getCount(curr, blinks);

    return prev + newCount;
  }, 0)
}

console.log({ partOne: countStones(splitInput, 25) });
console.log({ partOne: countStones(splitInput, 75) });
