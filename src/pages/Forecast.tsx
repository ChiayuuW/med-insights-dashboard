import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ForecastHeatMap } from "@/components/forecast/ForecastHeatMap";
import { StateDetailPanel } from "@/components/forecast/StateDetailPanel";
import { useForecastData } from "@/hooks/useForecastData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map, TrendingUp, Loader2 } from "lucide-react";

const Forecast = () => {
  const { data, isLoading, error } = useForecastData();
  const [viewMode, setViewMode] = useState<"forecast" | "qoq">("qoq");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
    setPanelOpen(true);
  };

  const selectedData = data?.find((d) => d.state_code === selectedState) ?? null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Quarterly Forecast Heat Map
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    State-level spending forecast & quarter-over-quarter growth
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(v) => v && setViewMode(v as "forecast" | "qoq")}
                className="bg-muted/30 border border-border rounded-lg p-1"
              >
                <ToggleGroupItem
                  value="qoq"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md px-3 py-1.5 text-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-1.5" />
                  QoQ Growth
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="forecast"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md px-3 py-1.5 text-sm"
                >
                  <Map className="w-4 h-4 mr-1.5" />
                  Forecast (Pred Q1)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                Failed to load forecast data. Please try again.
              </div>
            )}

            {data && (
              <>
                {/* Legend */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {viewMode === "qoq"
                        ? "Quarter-over-Quarter Spending Change"
                        : "Next Quarter Forecast (Pred Q1)"}
                    </h2>
                    <p className="text-xs text-muted-foreground">Click a state for details</p>
                  </div>

                  {/* Color legend */}
                  <div className="flex items-center justify-center gap-6 mb-4">
                    {viewMode === "qoq" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff4444" }} />
                          <span className="text-xs text-muted-foreground">Negative</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffeb3b" }} />
                          <span className="text-xs text-muted-foreground">Neutral</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#00cc66" }} />
                          <span className="text-xs text-muted-foreground">Positive</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(142 50% 55%)" }} />
                          <span className="text-xs text-muted-foreground">Lower</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(142 80% 30%)" }} />
                          <span className="text-xs text-muted-foreground">Higher</span>
                        </div>
                      </>
                    )}
                  </div>

                  <ForecastHeatMap
                    data={data}
                    viewMode={viewMode}
                    onStateClick={handleStateClick}
                  />
                </div>

                {/* Stats Grid */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    All States — {viewMode === "qoq" ? "QoQ Change" : "Pred Q1 Forecast"}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[260px] overflow-y-auto">
                    {[...data]
                      .sort((a, b) =>
                        viewMode === "qoq"
                          ? b.qoqChange - a.qoqChange
                          : Number(b.pred_q1) - Number(a.pred_q1)
                      )
                      .map((row) => (
                        <button
                          key={row.state_code}
                          onClick={() => handleStateClick(row.state_code)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer text-left"
                        >
                          <span className="font-mono text-xs font-medium text-foreground">
                            {row.state_code}
                          </span>
                          {viewMode === "qoq" ? (
                            <span
                              className={`text-xs font-mono font-semibold ${
                                row.qoqChange > 0
                                  ? "text-success"
                                  : row.qoqChange < 0
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {row.qoqChange > 0 ? "+" : ""}
                              {row.qoqChange.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-xs font-mono text-foreground">
                              ${Number(row.pred_q1).toLocaleString()}M
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* State Detail Panel */}
        <StateDetailPanel
          stateData={selectedData}
          open={panelOpen}
          onOpenChange={setPanelOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default Forecast;
