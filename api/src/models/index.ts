import { Moment } from "moment";

export interface Vessel {
  imo: number;
  name: string;
}

export interface Port {
  id: string;
  name: string;
}

export interface LogEntry {
  updatedField: string;
  arrival?: Moment;
  departure?: Moment;
  isOmitted?: boolean;
  createdDate: Moment;
}

export interface PortCall {
  arrival: Moment;
  departure: Moment;
  createdDate: Moment;
  isOmitted: boolean;
  service: string;
  port: Port;
  logEntries: Array<LogEntry>;
}

export interface VesselScheduleResponse {
  vessel: Vessel;
  portCalls: Array<PortCall>;
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

export interface Delays {
  delay2Days: number;
  delay7Days: number;
  delay14Days: number;
}
