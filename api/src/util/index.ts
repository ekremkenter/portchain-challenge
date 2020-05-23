import { LogEntry } from "../models";
import { Moment } from "moment";
import { orderBy } from "lodash";
import { PortCount } from "../../../web/src/api/models";

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

export function getPortCallDelays(
  logEntries: Array<LogEntry>,
  arrival: Moment
) {
  let delay2Days = 0;
  let delay7Days = 0;
  let delay14Days = 0;

  const arrivalLogEntries = logEntries.filter(
    logEntry => logEntry.updatedField === "arrival"
  );

  for (let i = arrivalLogEntries.length - 1; i >= 0; i -= 1) {
    const logEntry = arrivalLogEntries[i];
    const diffBtwArrivalAndLogEntry = Math.abs(
      arrival.diff(logEntry.createdDate, "days")
    );
    const delay = Math.round(
      Math.abs(arrival.diff(logEntry.arrival, "hours", true))
    );
    if (!delay2Days && diffBtwArrivalAndLogEntry >= 2) {
      delay2Days = delay;
    }
    if (!delay7Days && diffBtwArrivalAndLogEntry >= 7) {
      delay7Days = delay;
    }
    if (!delay14Days && diffBtwArrivalAndLogEntry >= 14) {
      delay14Days = delay;
    }

    if (delay2Days && delay7Days && delay14Days) {
      break;
    }
  }
  return { delay2Days, delay7Days, delay14Days };
}

export function sortAndGetTopN(
  counts: Map<string, number>,
  n: number,
  sortOrder: "desc" | "asc"
): Array<PortCount> {
  const portCounts = [...counts.entries()].map(entry => ({
    port: entry[0],
    count: entry[1]
  }));
  const orderedCounts = orderBy(
    portCounts,
    ["count", "port"],
    [sortOrder, "asc"]
  );
  return orderedCounts.slice(0, Math.min(n, orderedCounts.length));
}

export const ascendingSort = (a: number, b: number): number => a - b;
