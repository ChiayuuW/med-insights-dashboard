import { useState, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { SpendingBarChart } from "@/components/dashboard/SpendingBarChart";
import { TrendLineChart } from "@/components/dashboard/TrendLineChart";
import { TopStatesTable } from "@/components/dashboard/TopStatesTable";
import { USHeatMap } from "@/components/dashboard/USHeatMap";
import { FilterBar } from "@/components/dashboard/FilterBar";
import {
  allStateData,
  yearlyTrends,
  formatCurrency,
  formatNumber,
} from "@/data/medicaidData";
import { DollarSign, Users, TrendingUp, MapPin } from "lucide-react";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedState, setSelectedState] = useState("All States");

  const filteredData = useMemo(() => {
    let data = allStateData.filter((d) => d.year === selectedYear);
    if (selectedState !== "All States") {
      data = data.filter((d) => d.state === selectedState);
    }
    return data;
  }, [selectedYear, selectedState]);

  const previousYearData = useMemo(() => {
    let data = allStateData.filter((d) => d.year === selectedYear - 1);
    if (selectedState !== "All States") {
      data = data.filter((d) => d.state === selectedState);
    }
    return data;
  }, [selectedYear, selectedState]);

  const kpiData = useMemo(() => {
    const totalSpending = filteredData.reduce((sum, d) => sum + d.totalSpending, 0);
    const totalPopulation = filteredData.reduce((sum, d) => sum + d.population, 0);
    const avgPerCapita = totalPopulation > 0 ? totalSpending / totalPopulation : 0;

    const prevTotalSpending = previousYearData.reduce((sum, d) => sum + d.totalSpending, 0);
    const prevTotalPopulation = previousYearData.reduce((sum, d) => sum + d.population, 0);
    const prevAvgPerCapita = prevTotalPopulation > 0 ? prevTotalSpending / prevTotalPopulation : 0;

    const spendingChange = prevTotalSpending > 0
      ? ((totalSpending - prevTotalSpending) / prevTotalSpending) * 100
      : 0;
    const perCapitaChange = prevAvgPerCapita > 0
      ? ((avgPerCapita - prevAvgPerCapita) / prevAvgPerCapita) * 100
      : 0;

    const yearTrend = yearlyTrends.find((t) => t.year === selectedYear);
    const prevYearTrend = yearlyTrends.find((t) => t.year === selectedYear - 1);
    const enrolleesChange = prevYearTrend
      ? ((yearTrend!.enrollees - prevYearTrend.enrollees) / prevYearTrend.enrollees) * 100
      : 0;

    return {
      totalSpending,
      avgPerCapita,
      statesCount: filteredData.length,
      enrollees: yearTrend?.enrollees || 0,
      spendingChange,
      perCapitaChange,
      enrolleesChange,
    };
  }, [filteredData, previousYearData, selectedYear]);

  const handleReset = () => {
    setSelectedYear(2025);
    setSelectedState("All States");
  };

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
                    Medicaid Analytics Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    State Drug Utilization Data Analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Last updated:</span>
                <span className="font-mono text-foreground">Feb 6, 2026</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Filters */}
            <FilterBar
              selectedYear={selectedYear}
              selectedState={selectedState}
              onYearChange={setSelectedYear}
              onStateChange={setSelectedState}
              onReset={handleReset}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total Medicaid Spending"
                value={formatCurrency(kpiData.totalSpending, true)}
                change={kpiData.spendingChange}
                changeLabel="vs last year"
                icon={<DollarSign className="w-5 h-5" />}
                delay={0}
              />
              <KPICard
                title="Per Capita Spending"
                value={formatCurrency(kpiData.avgPerCapita)}
                change={kpiData.perCapitaChange}
                changeLabel="vs last year"
                icon={<TrendingUp className="w-5 h-5" />}
                delay={100}
              />
              <KPICard
                title="Total Enrollees"
                value={formatNumber(kpiData.enrollees, true)}
                change={kpiData.enrolleesChange}
                changeLabel="vs last year"
                icon={<Users className="w-5 h-5" />}
                delay={200}
              />
              <KPICard
                title="States Reporting"
                value={kpiData.statesCount.toString()}
                icon={<MapPin className="w-5 h-5" />}
                delay={300}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Per Capita Bar Chart */}
              <div className="bg-card rounded-xl border border-border p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Per-Capita Spending by State
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top 15 states ranked by per-capita Medicaid spending
                  </p>
                </div>
                <SpendingBarChart data={filteredData} />
              </div>

              {/* Trend Line Chart */}
              <div className="bg-card rounded-xl border border-border p-6 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Spending Trend Over Time
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Total spending and enrollee trends (2019-2025)
                  </p>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Total Spending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Enrollees</span>
                  </div>
                </div>
                <TrendLineChart data={yearlyTrends} />
              </div>
            </div>

            {/* US Heat Map */}
            <div className="bg-card rounded-xl border border-border p-6 opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Year-over-Year Spending Change by State
                </h2>
                <p className="text-sm text-muted-foreground">
                  Comparing {selectedYear} vs {selectedYear - 1} • Green = Higher, Red = Lower
                </p>
              </div>
              <USHeatMap data={filteredData} previousData={previousYearData} />
            </div>

            {/* Top States Table */}
            <div className="bg-card rounded-xl border border-border p-6 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Top 10 States by Total Spending
                </h2>
                <p className="text-sm text-muted-foreground">
                  Highest Medicaid spending states for {selectedYear}
                </p>
              </div>
              <TopStatesTable data={filteredData} />
            </div>

            {/* Footer Note */}
            <div className="text-center py-4 text-sm text-muted-foreground">
              <p>
                Data based on State Drug Utilization Data (SDUD). Sample data for demonstration.
              </p>
              <p className="mt-1">
                Connect your <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">sdud</code> and{" "}
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">state_population</code> tables for live data.
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
