export default function getPercentile(sortedNumbers: Array<number>, percentile: number) {
  if (percentile < 1 || percentile > 100 || !sortedNumbers.length) {
    return undefined;
  }
  if (percentile === 100) {
    return sortedNumbers[sortedNumbers.length - 1];
  }
  const index = (percentile / 100) * sortedNumbers.length;
  if (Number.isInteger(index)) {
    return (sortedNumbers[index - 1] + sortedNumbers[index]) / 2;
  } else {
    return sortedNumbers[Math.floor(index)];
  }
}

export const ascendingSort = (a: number, b: number) => a - b;