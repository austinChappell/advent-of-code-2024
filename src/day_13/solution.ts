// https://adventofcode.com/2024/day/13

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

interface Coords {
  x: number;
  y: number;
}
interface ClawMachine {
  buttonA: Coords;
  buttonB: Coords;
  prize: Coords;
}

const aButtonCost = 3;
const bButtonCost = 1;

// inputValue is something like "Button A: X+94, Y+34" or "Prize: X=7870, Y-6450"
const makeCoords = (inputValue: string): Coords => {
  const coordsString = inputValue.split(': ')[1];
  const [xString, yString] = coordsString.split(', ');
  const x = Number(xString.split(/[+,=]+/)[1]);
  const y = Number(yString.split(/[+,=]+/)[1]);

  return {
    x,
    y,
  }
}

const clawMachines: ClawMachine[] = input.split('\n\n')
  .map((clawMachine) => {
    const [buttonA, buttonB, prize] = clawMachine.split('\n');

    return {
      buttonA: makeCoords(buttonA),
      buttonB: makeCoords(buttonB),
      prize: makeCoords(prize),
    }
  })

const solveSystematicEquations = ({
  x1Multiplier,
  y1Multiplier,
  total1,
  x2Multiplier,
  y2Multiplier,
  total2,
}: {
  x1Multiplier: number;
  y1Multiplier: number;
  total1: number;
  x2Multiplier: number;
  y2Multiplier: number;
  total2: number;
}): { x: number; y: number } => {
  const total1ByX2 = total1 * x2Multiplier;
  const y1ByX2 = y1Multiplier * x2Multiplier;
  const total2ByX1 = total2 * x1Multiplier;
  const y2ByX1 = y2Multiplier * x1Multiplier;

  const totalsDiff = total2ByX1 - total1ByX2;
  const yDiff = y2ByX1 - y1ByX2;

  const y = totalsDiff / yDiff;

  const y1Temp = y * y1Multiplier;

  const total1Temp = total1 - y1Temp;

  const x = total1Temp / x1Multiplier;

  return { x, y };
}

const getClawMachinePrice = (clawMachine: ClawMachine, limit?: number) => {
  const distance = solveSystematicEquations({
    x1Multiplier: clawMachine.buttonA.x,
    y1Multiplier: clawMachine.buttonB.x,
    total1: clawMachine.prize.x,
    x2Multiplier: clawMachine.buttonA.y,
    y2Multiplier: clawMachine.buttonB.y,
    total2: clawMachine.prize.y,
  });

  if (!distance || (limit && (distance.x > limit || distance.y > limit))) {
    return 0;
  }

  const xIsInt = Number.isInteger(distance.x);
  const yIsInt = Number.isInteger(distance.y);

  if (!xIsInt || !yIsInt) {
    return 0;
  }

  const buttonAPressCount = distance.x;
  const buttonBPressCount = distance.y;

  const costA = buttonAPressCount * aButtonCost;
  const costB = buttonBPressCount * bButtonCost;

  return costA + costB;
}

console.log({
  partOne: clawMachines.reduce((prev, curr) => {
    return prev + getClawMachinePrice(curr, 100);
  }, 0),
  partTwo: clawMachines
    .map((clawMachine) => {
      return {
        ...clawMachine,
        prize: {
          x: clawMachine.prize.x + 10000000000000,
          y: clawMachine.prize.y + 10000000000000,
        }
      }
    })
    .reduce((prev, curr) => {
      return prev + getClawMachinePrice(curr);
    }, 0),
})