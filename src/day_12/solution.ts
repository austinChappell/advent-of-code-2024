// https://adventofcode.com/2024/day/12

import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const rowsAndColsInput = input.split('\n').map(row => row.split(''));

interface Plot {
  row: number;
  col: number;
}
type Position = 'top' | 'bottom' | 'left' | 'right';
type PlotWithPerimeterPositions = Plot & { perimeterPositions: Position[] };

interface Price {
  perimeterPrice: number;
  sidesPrice: number;
}

interface Region {
  plant: string;
  plots: Plot[];
}

const getPlant = ({
  grid,
  plot,
}: {
  grid: string[][];
  plot: Plot;
}): string | undefined => {
  return grid[plot.row]?.[plot.col] as string | undefined;
};

const getSetKey = (plot: Plot) => `${plot.row}:${plot.col}`;

const buildPlotsFromSet = (set: Set<string>): Plot[] => {
  const plots: Plot[] = [];

  set.forEach((value) => {
    const [row, col] = value.split(':').map(Number);

    plots.push({
      row,
      col,
    });
  });

  return plots;
}

const buildSetFromPlots = (plots: Plot[]): Set<string> => {
  const set = new Set<string>();

  plots.forEach(plot => {
    set.add(getSetKey(plot));
  });

  return set;
}

const findPlots = ({
  foundPlots,
  grid,
  plant,
  plot,
}: {
  foundPlots: Set<string>,
  grid: string[][];
  plant: string;
  plot: Plot;
}): Plot[] => {
  foundPlots.add(getSetKey(plot));

  const plotAbove: Plot = { col: plot.col, row: plot.row + 1 };
  const plotBelow: Plot = { col: plot.col, row: plot.row - 1 };
  const plotLeft: Plot = { col: plot.col - 1, row: plot.row };
  const plotRight: Plot = { col: plot.col + 1, row: plot.row };

  const plantAbove = getPlant({ grid, plot: plotAbove });
  const plantBelow = getPlant({ grid, plot: plotBelow });
  const plantLeft = getPlant({ grid, plot: plotLeft });
  const plantRight = getPlant({ grid, plot: plotRight });

  if (plantAbove === plant && !foundPlots.has(getSetKey(plotAbove))) {
    findPlots({ foundPlots, grid, plant, plot: plotAbove });
  }

  if (plantBelow === plant && !foundPlots.has(getSetKey(plotBelow))) {
    findPlots({ foundPlots, grid, plant, plot: plotBelow });
  }

  if (plantLeft === plant && !foundPlots.has(getSetKey(plotLeft))) {
    findPlots({ foundPlots, grid, plant, plot: plotLeft });
  }

  if (plantRight === plant && !foundPlots.has(getSetKey(plotRight))) {
    findPlots({ foundPlots, grid, plant, plot: plotRight });
  }

  return buildPlotsFromSet(foundPlots);
}

const buildRegionFromPlot = ({
  grid,
  plot,
}: {
  grid: string[][];
  plot: Plot;
}): Region => {
  const foundPlots = new Set<string>();

  const plant = grid[plot.row][plot.col];

  const plots = findPlots({
    foundPlots,
    grid,
    plant,
    plot,
  });

  return {
    plant,
    plots,
  };
}

const getRegions = ({
  grid,
}: {
  grid: string[][];
}): Region[] => {
  const usedPlots = new Set<string>();
  const regions: Region[] = [];

  grid.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const plot = { row: rowIndex, col: colIndex };

      if (!usedPlots.has(getSetKey(plot))) {
        const region = buildRegionFromPlot({
          grid,
          plot,
        });

        region.plots.forEach((plot) => {
          usedPlots.add(getSetKey(plot));
        });

        regions.push(region);
      }
    })
  })

  return regions;
}

const countSides = (plots: PlotWithPerimeterPositions[]) => {
  const tops = plots.filter(plot => plot.perimeterPositions.includes('top'));
  const bottoms = plots.filter(plot => plot.perimeterPositions.includes('bottom'));
  const lefts = plots.filter(plot => plot.perimeterPositions.includes('left'));
  const rights = plots.filter(plot => plot.perimeterPositions.includes('right'));

  let topCount = 0;
  let bottomCount = 0;
  let leftCount = 0;
  let rightCount = 0;

  tops.sort((a, b) => {
    if (a.row > b.row) {
      return 1;
    }

    if (a.row < b.row) {
      return -1;
    }

    return a.col > b.col ? 1 : -1;
  });
  bottoms.sort((a, b) => {
    if (a.row > b.row) {
      return 1;
    }

    if (a.row < b.row) {
      return -1;
    }

    return a.col > b.col ? 1 : -1;
  });
  lefts.sort((a, b) => {
    if (a.col > b.col) {
      return 1;
    }

    if (a.col < b.col) {
      return -1;
    }

    return a.row > b.row ? 1 : -1;
  });
  rights.sort((a, b) => {
    if (a.col > b.col) {
      return 1;
    }

    if (a.col < b.col) {
      return -1;
    }

    return a.row > b.row ? 1 : -1;
  });

  tops.forEach((top, index) => {
    const nextTop = tops[index + 1];

    if (!nextTop || nextTop.row !== top.row || nextTop.col !== top.col + 1) {
      topCount += 1;
    }
  });

  bottoms.forEach((bottom, index) => {
    const nextBottom = bottoms[index + 1];

    if (!nextBottom || nextBottom.row !== bottom.row || nextBottom.col !== bottom.col + 1) {
      bottomCount += 1;
    }
  });

  lefts.forEach((left, index) => {
    const nextLeft = lefts[index + 1];

    if (!nextLeft || nextLeft.col !== left.col || nextLeft.row !== left.row + 1) {
      leftCount += 1;
    }
  });

  rights.forEach((right, index) => {
    const nextRight = rights[index + 1];

    if (!nextRight || nextRight.col !== right.col || nextRight.row !== right.row + 1) {
      rightCount += 1;
    }
  });

  return topCount + bottomCount + leftCount + rightCount;
}

const getPerimeter = (region: Region) => {
  const plotSet = buildSetFromPlots(region.plots);
  const perimeterPlots: PlotWithPerimeterPositions[] = [];
  let perimeter = 0;

  region.plots.forEach((plot) => {
    const plotAbove = { row: plot.row - 1, col: plot.col };
    const plotBelow = { row: plot.row + 1, col: plot.col };
    const plotLeft = { row: plot.row, col: plot.col - 1 };
    const plotRight = { row: plot.row, col: plot.col + 1 };

    const missingPlots = [
      plotAbove,
      plotBelow,
      plotLeft,
      plotRight,
    ].filter(neighborPlot => !plotSet.has(getSetKey(neighborPlot)));

    perimeter += missingPlots.length;

    const positions: Position[] = [];

    missingPlots.forEach((borderPlot) => {
      const isTop = plotCompare(borderPlot, plotAbove);
      const isBottom = plotCompare(borderPlot, plotBelow);
      const isLeft = plotCompare(borderPlot, plotLeft);
      const isRight = plotCompare(borderPlot, plotRight);

      if (isTop) {
        positions.push('top');
      }

      if (isBottom) {
        positions.push('bottom');
      }

      if (isLeft) {
        positions.push('left');
      }

      if (isRight) {
        positions.push('right');
      }
    })

    if (positions.length) {
      perimeterPlots.push({
        ...plot,
        perimeterPositions: positions,
      });
    }
  });

  const sides = countSides(perimeterPlots);

  return {
    perimeter,
    sides,
  };
}

const plotCompare = (a: Plot, b: Plot) =>
  a.row === b.row && a.col === b.col;

const getPriceForRegion = (region: Region): Price => {
  const area = region.plots.length;
  const {
    perimeter,
    sides,
  } = getPerimeter(region);

  const perimeterPrice = area * perimeter;
  const sidesPrice = area * sides;

  return {
    perimeterPrice,
    sidesPrice,
  }
}

const findTotalCostBasedOnPerimeter = (grid: string[][]) => {
  const regions = getRegions({ grid });

  return regions.reduce<Price>((prev, curr) => {
    const currPrice = getPriceForRegion(curr);

    return {
      perimeterPrice: prev.perimeterPrice + currPrice.perimeterPrice,
      sidesPrice: prev.sidesPrice + currPrice.sidesPrice,
    }
  }, { perimeterPrice: 0, sidesPrice: 0 } as Price);
}

const price = findTotalCostBasedOnPerimeter(rowsAndColsInput);

console.log({
  partOne: price.perimeterPrice,
  partTwo: price.sidesPrice,
})
