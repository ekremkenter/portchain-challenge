import VesselService from "../service/VesselService";
import { VesselScheduleResponse } from "../models";
import getPercentile from "../util/getPercentile";

export default class VesselController {

  static async getSchedules() {
    const vessels = await VesselService.getVessels();
    const vesselSchedules: Array<VesselScheduleResponse> = await Promise.all(vessels.map(vessel => VesselService.getVesselSchedule(vessel.imo)));
    const portArrivals = new Map<string, number>();
    let portCallDurations: Array<number> = [];
    vesselSchedules.forEach(vesselSchedule => {
      vesselSchedule.portCalls.forEach(portCall => {
        let count = 1;
        let port = portCall.port.name;
        if (portArrivals.has(port)) {
          count += portArrivals.get(port)!;
        }
        portArrivals.set(port, count);

        if (!portCall.departure || !portCall.arrival) {
          console.log(portCall);
        }
        const portCallDurationMinutes = portCall.departure.diff(portCall.arrival, "minutes");
        portCallDurations.push(portCallDurationMinutes);
      });
    });

    const sortedMap = Array.from(portArrivals).sort(function(a, b) {
      return b[1] - a[1];
    });

    portCallDurations.sort((a, b) => a - b);
    const percentiles = [
      getPercentile(portCallDurations, 5),
      getPercentile(portCallDurations, 20),
      getPercentile(portCallDurations, 50),
      getPercentile(portCallDurations, 75),
      getPercentile(portCallDurations, 90)
    ];
    console.log(portCallDurations);
    console.log(percentiles);

    console.log(sortedMap);
    console.log(sortedMap.slice(0, Math.min(5, sortedMap.length)));
    console.log(sortedMap.slice(Math.max(5, sortedMap.length - 5)));

  }

}