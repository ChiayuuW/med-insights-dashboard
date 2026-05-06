import { useState, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TopStatesTable } from "@/components/dashboard/TopStatesTable";
import { allStateData, availableStates, availableYears, formatCurrency } from "@/data/medicaidData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StateComparison = () => {
  const [year, setYear] = useState(2025);
  const [stateA, setStateA] = useState("California");
  const [stateB, setStateB] = useState("Texas");

  const yearData = useMemo(() => allStateData.filter((d) => d.year === year), [year]);
  const a = yearData.find((d) => d.state === stateA);
  const b = yearData.find((d) => d.state === stateB);

  const stateOptions = availableStates.filter((s) => s !== "All States");

  const Row = ({ label, av, bv }: { label: string; av: string; bv: string }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{av}</span>
      <span className="font-mono text-foreground">{bv}</span>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">State Comparison</h1>
                <p className="text-sm text-muted-foreground">Side-by-side metrics and top spenders</p>
              </div>
            </div>
          </header>
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-4 p-4 bg-card/50 rounded-xl border border-border">
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableYears.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stateA} onValueChange={setStateA}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stateB} onValueChange={setStateB}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {a && b && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border mb-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Metric</span>
                  <span className="font-semibold text-primary">{a.state}</span>
                  <span className="font-semibold text-primary">{b.state}</span>
                </div>
                <Row label="Total Spending" av={formatCurrency(a.totalSpending, true)} bv={formatCurrency(b.totalSpending, true)} />
                <Row label="Population" av={a.population.toLocaleString()} bv={b.population.toLocaleString()} />
                <Row label="Per Capita" av={formatCurrency(a.perCapita)} bv={formatCurrency(b.perCapita)} />
                <Row label="Per Capita Δ" av={`${(((a.perCapita - b.perCapita) / b.perCapita) * 100).toFixed(1)}%`} bv={`${(((b.perCapita - a.perCapita) / a.perCapita) * 100).toFixed(1)}%`} />
              </div>
            )}

            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Top 10 States — {year}</h2>
              <TopStatesTable data={yearData} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StateComparison;