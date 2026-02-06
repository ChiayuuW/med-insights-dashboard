import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency, formatNumber } from "@/data/medicaidData";

interface TrendLineChartProps {
  data: Array<{
    year: number;
    totalSpending: number;
    enrollees: number;
  }>;
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(185 80% 50%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(185 80% 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="enrolleesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="spending"
            orientation="left"
            tickFormatter={(value) => formatCurrency(value, true)}
            tick={{ fill: "hsl(var(--primary))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <YAxis
            yAxisId="enrollees"
            orientation="right"
            tickFormatter={(value) => formatNumber(value, true)}
            tick={{ fill: "hsl(var(--success))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-popover border border-border rounded-lg p-4 shadow-xl">
                  <p className="font-bold text-foreground text-lg mb-2">{label}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-muted-foreground text-sm">Total Spending:</span>
                      <span className="text-primary font-mono font-semibold">
                        {formatCurrency(payload[0]?.value as number, true)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-muted-foreground text-sm">Enrollees:</span>
                      <span className="text-success font-mono font-semibold">
                        {formatNumber(payload[1]?.value as number, true)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Area
            yAxisId="spending"
            type="monotone"
            dataKey="totalSpending"
            stroke="hsl(185 80% 50%)"
            strokeWidth={3}
            fill="url(#spendingGradient)"
            dot={{ fill: "hsl(185 80% 50%)", strokeWidth: 0, r: 4 }}
            activeDot={{
              fill: "hsl(185 80% 50%)",
              stroke: "hsl(185 80% 70%)",
              strokeWidth: 2,
              r: 6,
            }}
          />
          <Area
            yAxisId="enrollees"
            type="monotone"
            dataKey="enrollees"
            stroke="hsl(142 71% 45%)"
            strokeWidth={2}
            fill="url(#enrolleesGradient)"
            dot={{ fill: "hsl(142 71% 45%)", strokeWidth: 0, r: 3 }}
            activeDot={{
              fill: "hsl(142 71% 45%)",
              stroke: "hsl(142 71% 55%)",
              strokeWidth: 2,
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
