import fs from 'fs';

const input = fs.readFileSync('./data.txt', 'utf-8');

const reports = input.split('\n').map((line) => line.split(' ').map(Number))

const isReportSafe = (report: number[]): boolean => {
  const diffs = report.map((num, index) => {
    if (index === 0) {
      return null;
    }

    return num - report[index - 1];
  }).filter((diff) => diff !== null);

  if (diffs.includes(0)) {
    return false;
  }

  const hasLargeDiffs = diffs.some(n => Math.abs(n) > 3);

  if (hasLargeDiffs) {
    return false;
  }

  const changesDirection = diffs.some(n => n < 0) && diffs.some(n => n > 0);

  if (changesDirection) {
    return false;
  }

  return true;
}

const safeReportCount = reports.reduce((prev, curr) => {
  const isSafe = isReportSafe(curr);

  return prev + Number(isSafe);
}, 0);

console.log({ safeReportCount })

const isSafeWithRemoval = (report: number[]): boolean => {
  if (isReportSafe(report)) {
    return true;
  }

  return report.some((val, index) => {
    const reportWithoutValue = report.filter((n, i) => i !== index);

    return isReportSafe(reportWithoutValue);
  })
}

const safeWithRemovalCount = reports.reduce((prev, curr) => {
  const isSafe = isSafeWithRemoval(curr);

  return prev + Number(isSafe);
}, 0);

console.log({ safeWithRemovalCount })
