import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PortCount } from "../api/models";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#e53935"];

export default function PortCountChart({ data }: { data: Array<PortCount> }) {
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
