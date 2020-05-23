import React from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import PortCountChart from "./PortCountChart";
import { Data } from "../api/models";
import DataCard from "./DataCard";

export default function DataView({ data }: { data: Data }) {
  return (
    <div role="data">
      <DataCard
        title="The top 5 ports with the most arrivals, and the corresponding number of total port calls for each port."
        child={<PortCountChart data={data.portsWithMostArrivals} />}
      />
      <DataCard
        title="The top 5 ports that have the fewest port calls, and the number of
            total port calls for each port"
        child={<PortCountChart data={data.portsWithFewestPortCalls} />}
      />
      <DataCard
        title="The percentiles of port call durations"
        child={
          <Table aria-label="Port call durations">
            <TableHead>
              <TableRow>
                {data.portCallDurationNthPercentiles.map(value => (
                  <TableCell key={value}>P{value}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {data.portCallDurations.map((duration, index) => (
                  <TableCell key={duration}>{duration}mins</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        }
      />
      <DataCard
        title="Port call delays"
        child={
          <Table aria-label="Port call delays">
            <TableHead>
              <TableRow>
                <TableCell align="left">Vessel Name</TableCell>
                {[14, 7, 2].map(value => (
                  <TableCell key={value} align="center" colSpan={3}>
                    {value} days from arrival
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                {[14, 7, 2].map(_ =>
                  data.portDelayNthPercentiles.map(th => (
                    <TableCell key={th} align="right">
                      P{th}
                    </TableCell>
                  ))
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.vesselPortCallDelays.map(
                ({ vessel, when2, when7, when14 }) => (
                  <TableRow key={vessel.imo}>
                    <TableCell>{vessel.name}</TableCell>
                    {[when14, when7, when2].map(delays =>
                      delays.map(value => (
                        <TableCell key={value} align="right">
                          {value}h
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        }
      />
    </div>
  );
}
