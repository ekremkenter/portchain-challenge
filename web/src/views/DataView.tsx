import React from "react";
import { Data } from "../api/models";
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

export default function DataView({ data }: { data: Data }) {
  return (
    <div role="data">
      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            The top 5 ports with the most arrivals, and the corresponding number
            of total port calls for each port.
          </Typography>
          <PortCountChart data={data.portsWithMostArrivals} />
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            The top 5 ports that have the fewest port calls, and the number of
            total port calls for each port
          </Typography>

          <PortCountChart data={data.portsWithFewestPortCalls} />
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            The percentiles of port call durations
          </Typography>

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
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Port call delays
          </Typography>

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
                <TableCell></TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
