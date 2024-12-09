// https://adventofcode.com/2024/day/9

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const getCheckSum = (diskMap: string[]) => {
  return diskMap.reduce((prev, curr, index) => {
    if (Number.isNaN(Number(curr))) {
      return prev;
    }

    const product = Number(curr) * index;

    return product + prev;
  }, 0);
}

const buildDiskMap = () => {
  let id = 0;

  return input.split('').map((block, index) => {
    const isFile = index % 2 === 0;

    const fillValue = isFile ? `${id}` : '.';

    const value = Array(Number(block)).fill(fillValue);

    if (isFile) {
      id += 1;
    }

    return value;
  }).filter(block => !!block.length);
}

const optimizeDiskMap = (diskMapInput: string[]) => {
  let lastFileBlockIndex = diskMapInput.length - 1 - diskMapInput.slice().reverse().findIndex(char => !char.startsWith('.'));
  let firstFreeSpaceIndex = diskMapInput.findIndex(char => char === '.');

  while (firstFreeSpaceIndex > -1 && firstFreeSpaceIndex < lastFileBlockIndex) {
    diskMapInput[firstFreeSpaceIndex] = diskMapInput[lastFileBlockIndex];
    diskMapInput[lastFileBlockIndex] = '.';

    lastFileBlockIndex = diskMapInput.length - 1 - diskMapInput.slice().reverse().findIndex(char => !char.startsWith('.'));
    firstFreeSpaceIndex = diskMapInput.findIndex(char => char === '.');
  }

  return diskMapInput;
}

const optimizedDiskMap = optimizeDiskMap(buildDiskMap().flat());

console.log({ partOne: getCheckSum(optimizedDiskMap) });

const wholeFileOptimizedDiskMap = (diskMapInput: string[][]) => {
  let lastFileBlockIndex = diskMapInput.length - 1 - diskMapInput.slice().reverse().findIndex(char => !Number.isNaN(Number(char[0])));
  let firstFreeSpaceIndex = diskMapInput.findIndex(char => char[0] === '.');

  let maxFileIndex = diskMapInput.length;

  while (firstFreeSpaceIndex > -1 && firstFreeSpaceIndex < lastFileBlockIndex) {
    const fileLength = diskMapInput[lastFileBlockIndex].length;

    const availableFreeSpaceIndex = diskMapInput.findIndex((value, index) => {
      return value[0] === '.' && value.length >= fileLength && index < lastFileBlockIndex;
    });

    if (availableFreeSpaceIndex > -1) {
      const freeSpace = diskMapInput[availableFreeSpaceIndex];
      const remainingFreeSpace = freeSpace.slice(fileLength);
      const freeSpaceValueToSwap = Array(fileLength).fill('.');

      diskMapInput[availableFreeSpaceIndex] = diskMapInput[lastFileBlockIndex];
      diskMapInput[lastFileBlockIndex] = freeSpaceValueToSwap;

      diskMapInput.splice(availableFreeSpaceIndex + 1, 0, remainingFreeSpace);
    } else {
      maxFileIndex -= 1;
    }

    const invertedMaxFileIndex = diskMapInput.length - 1 - maxFileIndex;
    lastFileBlockIndex = diskMapInput.length - 1 - diskMapInput.slice().reverse().findIndex((char, index) => index > invertedMaxFileIndex && !Number.isNaN(Number(char[0])));
    firstFreeSpaceIndex = diskMapInput.findIndex(char => char[0] === '.');
  }

  return diskMapInput;
}

console.log({ partTwo: getCheckSum(wholeFileOptimizedDiskMap(buildDiskMap()).flat()) })
