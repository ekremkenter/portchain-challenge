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
