import React, { useEffect, useState } from "react";
import "./App.css";
import { Data, PortCount } from "./api/models";
import Api from "./api/Api";
import {
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data>();

  useEffect(function() {
    const api = new Api();
    api
      .getData()
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        alert(e);
      });
  }, []);

  return (
    <div className="App">
      {loading && (
        <div className="flex-center" role="loading">
          <CircularProgress />
        </div>
      )}
      {data && <DataView data={data} />}
      <Card className="card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Base URL
          </Typography>
          {process.env.REACT_APP_BASE_URL}
        </CardContent>
      </Card>
    </div>
  );
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#e53935"];

function DataView({ data }: { data: Data }) {
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
                  <TableCell key={duration}>{duration} min</TableCell>
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

function PortCountChart({ data }: { data: Array<PortCount> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart height={250}>
        <Pie
          valueKey="count"
          nameKey="port"
          dataKey="count"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#82ca9d"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index
          }) => {
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            // @ts-ignore
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            // @ts-ignore
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            // @ts-ignore
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#8884d8"
                textAnchor={x > cx! ? "start" : "end"}
                dominantBaseline="central"
              >
                {data[index!].port} ({value})
              </text>
            );
          }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default App;
