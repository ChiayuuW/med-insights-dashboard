import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ProcessedForecast } from "@/hooks/useForecastData";

interface StateLineChartProps {
  data: ProcessedForecast;
}

export function StateLineChart({ data }: StateLineChartProps) {
  const chartData = [
    { quarter: "2024 Q1", value: Number(data["2024Q1"]), type: "actual" },
    { quarter: "2024 Q2", value: Number(data["2024Q2"]), type: "actual" },
    { quarter: "2024 Q3", value: Number(data["2024Q3"]), type: "actual" },
    { quarter: "2024 Q4", value: Number(data["2024Q4"]), type: "actual" },
    { quarter: "Pred Q1", value: Number(data.pred_q1), type: "forecast" },
    { quarter: "Pred Q2", value: Number(data.pred_q2), type: "forecast" },
    { quarter: "Pred Q3", value: Number(data.pred_q3), type: "forecast" },
    { quarter: "Pred Q4", value: Number(data.pred_q4), type: "forecast" },
  ];

  // Split into actual and forecast for dual lines
  const actualData = chartData.map((d) => ({
    ...d,
    actual: d.type === "actual" ? d.value : undefined,
    forecast: d.quarter === "2024 Q4" || d.type === "forecast" ? d.value : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={actualData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="quarter"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
            fontSize: 12,
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}M`, ""]}
        />
        <ReferenceLine
          x="2024 Q4"
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="4 4"
          opacity={0.5}
          label={{ value: "Forecast →", position: "top", fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="hsl(var(--success))"
          strokeWidth={2.5}
          strokeDasharray="6 3"
          dot={{ fill: "hsl(var(--success))", r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
