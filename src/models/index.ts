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
  arrival?: string;
  departure?: string;
  isOmitted?: boolean;
  createdDate: string;
}

export interface PortCall {
  arrival: string;
  departure: string;
  createdDate: string;
  isOmitted: boolean;
  service: string;
  port: Port;
  logEntries: Array<LogEntry>;
}

export interface VesselScheduleResponse {
  vessel: Vessel;
  portCalls: Array<PortCall>;
}