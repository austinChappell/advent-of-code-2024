// https://adventofcode.com/2024/day/9

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

let id = 0;

const diskMap = input.split('').flatMap((block, index) => {
  const isFile = index % 2 === 0;

  const fillValue = isFile ? `${id}` : '.';

  const value = Array(Number(block)).fill(fillValue);

  if (isFile) {
    id += 1;
  }

  return value;
});

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

const optimizedDiskMap = optimizeDiskMap(diskMap);

const fileSystemChecksum = optimizedDiskMap.reduce((prev, curr, index) => {
  if (curr === '.') {
    return prev;
  }

  const product = Number(curr) * index;

  return product + prev;
}, 0);

console.log({ partOne: fileSystemChecksum });
