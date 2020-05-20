export default function getPercentile(numbers: Array<number>, percentile: number) {
  return numbers[Math.min(numbers.length - 1, Math.ceil(numbers.length * percentile / 100))];
}