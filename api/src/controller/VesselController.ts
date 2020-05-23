import { VesselService } from "../service";
import { Vessel, VesselScheduleResponse } from "../models";
import { getPercentiles, getPortCallDelays, sortAndGetTopN } from "../util";

interface Data {
  portDelayNthPercentiles: Array<number>;
  portCallDurationNthPercentiles: Array<number>;
  portsWithMostArrivals: Array<PortCount>;
  portsWithFewestPortCalls: Array<PortCount>;
  portCallDurations: Array<number>;
  vesselPortCallDelays: Array<VesselPortCallDelay>;
}

interface PortCount {
  port: string;
  count: number;
}

interface VesselPortCallDelay {
  vessel: Vessel;
  when2: Array<number>;
  when7: Array<number>;
  when14: Array<number>;
}

const portDelayNthPercentiles = [5, 50, 80];
const portCallDurationNthPercentiles = [5, 20, 50, 75, 90];

export default class VesselController {
  readonly service: VesselService;

  constructor(service: VesselService) {
    this.service = service;
  }

  async getData(): Promise<Data> {
    const data = {
      portDelayNthPercentiles,
      portCallDurationNthPercentiles,
      vesselPortCallDelays: new Array<VesselPortCallDelay>()
    } as Data;
    const vessels = await this.service.getVessels();
    const vesselSchedules: Array<VesselScheduleResponse> = await Promise.all(
      vessels.map(vessel => this.service.getVesselSchedule(vessel.imo))
    );
    const portArrivalCounts = new Map<string, number>();
    const portCallCounts = new Map<string, number>();

    const portCallDurations = new Array<number>();
    for (const { vessel, portCalls } of vesselSchedules) {
      const delaysInMinute2DaysAgo = new Array<number>();
      const delaysInMinute7DaysAgo = new Array<number>();
      const delaysInMinute14DaysAgo = new Array<number>();
      for (const portCall of portCalls) {
        const port = portCall.port.name;
        portCallCounts.set(port, (portCallCounts.get(port) || 0) + 1);
        if (!portCall.isOmitted) {
          portArrivalCounts.set(port, (portArrivalCounts.get(port) || 0) + 1);

          if (portCall.departure && portCall.arrival) {
            const portCallDurationMinutes = portCall.departure.diff(
              portCall.arrival,
              "minutes"
            );
            portCallDurations.push(portCallDurationMinutes);
            const { delay2Days, delay7Days, delay14Days } = getPortCallDelays(
              portCall.logEntries,
              portCall.arrival
            );

            delaysInMinute2DaysAgo.push(delay2Days);
            delaysInMinute7DaysAgo.push(delay7Days);
            delaysInMinute14DaysAgo.push(delay14Days);
          }
        }
      }

      data.vesselPortCallDelays.push({
        vessel,
        when2: getPercentiles(delaysInMinute2DaysAgo, portDelayNthPercentiles),
        when7: getPercentiles(delaysInMinute7DaysAgo, portDelayNthPercentiles),
        when14: getPercentiles(delaysInMinute14DaysAgo, portDelayNthPercentiles)
      });
    }

    data.portCallDurations = getPercentiles(
      portCallDurations,
      portCallDurationNthPercentiles
    );

    data.portsWithMostArrivals = sortAndGetTopN(portArrivalCounts, 5, "desc");
    data.portsWithFewestPortCalls = sortAndGetTopN(portCallCounts, 5, "asc");

    return data;
  }
}
