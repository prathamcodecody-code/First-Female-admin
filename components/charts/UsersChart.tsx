"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UsersLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#E91E63"      // brandPink
          strokeWidth={3}
          dot={{ fill: "#9C27B0" }} // brandPurple
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
