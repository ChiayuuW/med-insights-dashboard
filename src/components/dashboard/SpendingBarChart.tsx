import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/data/medicaidData";

interface SpendingBarChartProps {
  data: Array<{
    state: string;
    stateAbbr: string;
    perCapita: number;
  }>;
}

export function SpendingBarChart({ data }: SpendingBarChartProps) {
  // Sort by per capita and take top 15
  const chartData = [...data]
    .sort((a, b) => b.perCapita - a.perCapita)
    .slice(0, 15);

  const maxValue = Math.max(...chartData.map((d) => d.perCapita));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value, true)}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            type="category"
            dataKey="stateAbbr"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            width={50}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--accent) / 0.3)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
                  <p className="font-semibold text-foreground">{data.state}</p>
                  <p className="text-primary font-mono text-lg">
                    {formatCurrency(data.perCapita)}
                  </p>
                  <p className="text-xs text-muted-foreground">Per capita spending</p>
                </div>
              );
            }}
          />
          <Bar dataKey="perCapita" radius={[0, 4, 4, 0]} maxBarSize={24}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(185 80% ${50 - (index / chartData.length) * 20}%)`}
                style={{
                  filter: index === 0 ? "drop-shadow(0 0 8px hsl(185 80% 50% / 0.5))" : "none",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
