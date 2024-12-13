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

const calc = ({
  clawMachine,
}: {
  clawMachine: ClawMachine;
}): {
  buttonA: number;
  buttonB: number;
} | null => {
  const aHypInterval = getHypotenuse(clawMachine.buttonA);
  const bHypInterval = getHypotenuse(clawMachine.buttonB);
  const distanceHyp = getHypotenuse(clawMachine.prize);

  const aCost = aHypInterval / aButtonCost;
  const bCost = bHypInterval / bButtonCost;

  let foundSolution = false;
  let mostEfficient: keyof ClawMachine = aCost > bCost ? 'buttonA' : 'buttonB';
  let leastEfficient: keyof ClawMachine = mostEfficient === 'buttonA' ? 'buttonB' : 'buttonA';
  let mostEfficientCount = mostEfficient === 'buttonA'
    ? Math.ceil(distanceHyp / aHypInterval)
    : Math.ceil(distanceHyp / bHypInterval);
  let leastEfficientCount = 0;

  while (mostEfficientCount > -1 && !foundSolution) {
    const xDistance = clawMachine[mostEfficient].x * mostEfficientCount;
    const yDistance = clawMachine[mostEfficient].y * mostEfficientCount;
    const clawCoords: Coords = {
      x: xDistance,
      y: yDistance,
    };

    leastEfficientCount = 0;

    while (clawCoords.x <= clawMachine.prize.x && clawCoords.y <= clawMachine.prize.y && !foundSolution) {
      if (clawCoords.x === clawMachine.prize.x && clawCoords.y === clawMachine.prize.y) {
        foundSolution = true;
      } else {
        clawCoords.x += clawMachine[leastEfficient].x;
        clawCoords.y += clawMachine[leastEfficient].y;
        leastEfficientCount++;
      }
    }

    if (!foundSolution) {
      mostEfficientCount--;
    }
  }

  if (!foundSolution) {
    return null;
  }

  if (mostEfficientCount > 100 || leastEfficientCount > 100) {
    return null;
  }

  return {
    [mostEfficient]: mostEfficientCount,
    [leastEfficient]: leastEfficientCount,
  } as {
    buttonA: number;
    buttonB: number;
  }
}

const getHypotenuse = (coords: Coords): number => {
  return Math.sqrt(Math.pow(coords.x, 2) + Math.pow(coords.y, 2));
}

console.log({
  partOne: clawMachines.reduce((prev, curr) => {
    const currentDistance = calc({ clawMachine: curr });

    if (!currentDistance) {
      return prev;
    }

    const buttonAPressCount = currentDistance.buttonA;
    const buttonBPressCount = currentDistance.buttonB;

    const costA = buttonAPressCount * aButtonCost;
    const costB = buttonBPressCount * bButtonCost;

    const costForCurrent = costA + costB;

    return prev + costForCurrent;
  }, 0),
})