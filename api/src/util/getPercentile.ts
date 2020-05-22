export function getPercentile(
  sortedNumbers: Array<number>,
  percentile: number
): number {
  if (percentile < 1 || percentile > 100 || !sortedNumbers.length) {
    throw new Error("Invalid value");
  }
  if (percentile === 100) {
    return sortedNumbers[sortedNumbers.length - 1];
  }
  const index = (percentile / 100) * sortedNumbers.length;
  if (Number.isInteger(index)) {
    return (sortedNumbers[index - 1] + sortedNumbers[index]) / 2;
  }
  return sortedNumbers[Math.floor(index)];
}

export function getPercentiles(
  numbers: Array<number>,
  percentiles: Array<number>
): Array<number> {
  numbers.sort(ascendingSort);
  return percentiles.map(percentile => getPercentile(numbers, percentile));
}

export const ascendingSort = (a: number, b: number): number => a - b;
