import { useState, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SpendingBarChart } from "@/components/dashboard/SpendingBarChart";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { allStateData, formatCurrency } from "@/data/medicaidData";

const SpendingAnalysis = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedState, setSelectedState] = useState("All States");

  const data = useMemo(() => {
    let d = allStateData.filter((x) => x.year === selectedYear);
    if (selectedState !== "All States") d = d.filter((x) => x.state === selectedState);
    return d;
  }, [selectedYear, selectedState]);

  const total = data.reduce((s, d) => s + d.totalSpending, 0);
  const avgPerCapita = data.length ? data.reduce((s, d) => s + d.perCapita, 0) / data.length : 0;
  const top = [...data].sort((a, b) => b.perCapita - a.perCapita)[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Spending Analysis</h1>
                <p className="text-sm text-muted-foreground">Deep dive into per-capita spending across states</p>
              </div>
            </div>
          </header>
          <div className="p-6 space-y-6">
            <FilterBar
              selectedYear={selectedYear}
              selectedState={selectedState}
              onYearChange={setSelectedYear}
              onStateChange={setSelectedState}
              onReset={() => { setSelectedYear(2025); setSelectedState("All States"); }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Total Spending</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(total, true)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Avg Per Capita</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(avgPerCapita)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Highest Per Capita</p>
                <p className="text-2xl font-bold text-foreground mt-1">{top?.stateAbbr ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-1">{top ? formatCurrency(top.perCapita) : ""}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Per-Capita Spending Ranking</h2>
              <SpendingBarChart data={data} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SpendingAnalysis;