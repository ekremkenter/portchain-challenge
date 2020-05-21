import { VesselService } from "../service";
import { LogEntry, Vessel, VesselScheduleResponse } from "../models";
import { ascendingSort, getPercentiles } from "../util";
import { Moment } from "moment";
import { orderBy } from "lodash";

interface Data {
  portsWithMostArrivals: Array<PortCount>;
  portsWithFewestPortCalls: Array<PortCount>;
  portCallDurationPercentiles: Array<number>;
  vesselPortCallDelayPercentiles: Map<Vessel, PortCallDelayPercentile>;
}

interface PortCount {
  port: string;
  count: number;
}

interface PortCallDelayPercentile {
  when2: Array<number>;
  when7: Array<number>;
  when14: Array<number>;
}

const portDelayPercentiles = [5, 50, 80];
const portCallDurationPercentiles = [5, 20, 50, 75, 90];

export default class VesselController {
  static async getData(): Promise<Data> {
    const data = {
      vesselPortCallDelayPercentiles: new Map<
        Vessel,
        PortCallDelayPercentile
      >(),
    } as Data;
    const vessels = await VesselService.getVessels();
    const vesselSchedules: Array<VesselScheduleResponse> = await Promise.all(
      vessels.map((vessel) => VesselService.getVesselSchedule(vessel.imo))
    );
    const portArrivalCounts = new Map<string, number>();
    const portCallCounts = new Map<string, number>();

    let portCallDurations = new Array<number>();
    for (const { vessel, portCalls } of vesselSchedules) {
      let delaysInMinute2DaysAgo = new Array<number>();
      let delaysInMinute7DaysAgo = new Array<number>();
      let delaysInMinute14DaysAgo = new Array<number>();
      for (const portCall of portCalls) {
        const port = portCall.port.name;
        portCallCounts.set(port, (portCallCounts.get(port) || 0) + 1);
        if (portCall.isOmitted) {
          continue;
        }
        portArrivalCounts.set(port, (portArrivalCounts.get(port) || 0) + 1);

        if (!portCall.departure || !portCall.arrival) {
          console.log(portCall);
        }
        const portCallDurationMinutes = portCall.departure?.diff(
          portCall.arrival,
          "minutes"
        );
        portCallDurations.push(portCallDurationMinutes);

        console.log(port);
        let { delay2Days, delay7Days, delay14Days } = this.getPortCallDelays(
          portCall.logEntries,
          portCall.arrival
        );

        delaysInMinute2DaysAgo.push(delay2Days);
        delaysInMinute7DaysAgo.push(delay7Days);
        delaysInMinute14DaysAgo.push(delay14Days);

        console.log("Delays", delay2Days, delay7Days, delay14Days);
      }

      data.vesselPortCallDelayPercentiles.set(vessel, {
        when2: getPercentiles(delaysInMinute2DaysAgo, portDelayPercentiles),
        when7: getPercentiles(delaysInMinute7DaysAgo, portDelayPercentiles),
        when14: getPercentiles(delaysInMinute14DaysAgo, portDelayPercentiles),
      });
    }

    portCallDurations.sort(ascendingSort);
    data.portCallDurationPercentiles = getPercentiles(
      portCallDurations,
      portCallDurationPercentiles
    );
    console.log(portArrivalCounts);
    console.log(portCallCounts);

    data.portsWithMostArrivals = this.sortAndGetTopN(portCallCounts, 5, "desc");
    data.portsWithFewestPortCalls = this.sortAndGetTopN(
      portCallCounts,
      5,
      "asc"
    );

    console.log(data);
    return data;
  }

  static sortAndGetTopN(
    counts: Map<string, number>,
    n: number,
    sortOrder: "desc" | "asc"
  ): Array<PortCount> {
    const portCounts = [...counts.entries()].map((entry) => ({
      port: entry[0],
      count: entry[1],
    }));
    console.log(portCounts);
    const orderedCounts = orderBy(
      portCounts,
      ["count", "port"],
      [sortOrder, "asc"]
    );
    return orderedCounts.slice(0, Math.min(n, orderedCounts.length));
  }

  private static getPortCallDelays(
    logEntries: Array<LogEntry>,
    arrival: Moment
  ) {
    let delay2Days = 0;
    let delay7Days = 0;
    let delay14Days = 0;

    const arrivalLogEntries = logEntries.filter(
      (logEntry) => logEntry.updatedField === "arrival"
    );

    for (let i = arrivalLogEntries.length - 1; i >= 0; i--) {
      const logEntry = arrivalLogEntries[i];
      const diffBtwArrivalAndLogEntry = Math.abs(
        arrival.diff(logEntry.createdDate, "days")
      );
      const delay = Math.round(
        Math.abs(arrival.diff(logEntry.arrival, "hours", true))
      );
      console.log(
        `${diffBtwArrivalAndLogEntry} days ago delay was ${delay} hours`
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
}
