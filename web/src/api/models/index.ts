import { Vessel } from "../../../../api/src/models";

export interface ApiResponse {
  success: boolean;
  data?: Data | any;
  message?: string;
}

export interface Data {
  portDelayNthPercentiles: Array<number>;
  portCallDurationNthPercentiles: Array<number>;
  portsWithMostArrivals: Array<PortCount>;
  portsWithFewestPortCalls: Array<PortCount>;
  portCallDurations: Array<number>;
  vesselPortCallDelays: Array<VesselPortCallDelay>;
}

export interface PortCount {
  port: string;
  count: number;
}

export interface VesselPortCallDelay {
  vessel: Vessel;
  when2: Array<number>;
  when7: Array<number>;
  when14: Array<number>;
}
