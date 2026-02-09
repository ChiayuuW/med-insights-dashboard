import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StateLineChart } from "./StateLineChart";
import { stateCodeToName, type ProcessedForecast } from "@/hooks/useForecastData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StateDetailPanelProps {
  stateData: ProcessedForecast | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StateDetailPanel({ stateData, open, onOpenChange }: StateDetailPanelProps) {
  if (!stateData) return null;

  const stateName = stateCodeToName[stateData.state_code] ?? stateData.state_code;
  const isPositive = stateData.qoqChange >= 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl text-foreground flex items-center gap-2">
            {stateName} ({stateData.state_code})
            <span
              className={`inline-flex items-center gap-1 text-sm font-mono px-2 py-0.5 rounded-full ${
                isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {stateData.qoqChange.toFixed(1)}%
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Last Known Actual */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Last Known Actual (2024 Q4)</h3>
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <p className="text-2xl font-bold font-mono text-foreground">
                ${Number(stateData["2024Q4"]).toLocaleString()}M
              </p>
            </div>
          </div>

          {/* Forecast Quarters */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Forecasted Quarters</h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { label: "Pred Q1", value: stateData.pred_q1 },
                { label: "Pred Q2", value: stateData.pred_q2 },
                { label: "Pred Q3", value: stateData.pred_q3 },
                { label: "Pred Q4", value: stateData.pred_q4 },
              ] as const).map((q) => (
                <div
                  key={q.label}
                  className="bg-muted/20 border border-border/50 rounded-lg p-3"
                >
                  <p className="text-xs text-muted-foreground">{q.label}</p>
                  <p className="text-lg font-semibold font-mono text-foreground">
                    ${Number(q.value).toLocaleString()}M
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Historical + Forecast Trend
            </h3>
            <div className="bg-muted/10 border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-primary rounded" />
                  <span className="text-xs text-muted-foreground">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-success rounded border-dashed border-t border-success" />
                  <span className="text-xs text-muted-foreground">Forecast</span>
                </div>
              </div>
              <StateLineChart data={stateData} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
