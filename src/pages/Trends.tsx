import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TrendLineChart } from "@/components/dashboard/TrendLineChart";
import { yearlyTrends, formatCurrency, formatNumber } from "@/data/medicaidData";

const Trends = () => {
  const latest = yearlyTrends[yearlyTrends.length - 1];
  const first = yearlyTrends[0];
  const growth = ((latest.totalSpending - first.totalSpending) / first.totalSpending) * 100;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Trends</h1>
                <p className="text-sm text-muted-foreground">Historical spending and enrollment trajectory</p>
              </div>
            </div>
          </header>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Spending {first.year}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(first.totalSpending, true)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Spending {latest.year}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(latest.totalSpending, true)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Total Growth</p>
                <p className="text-2xl font-bold text-success mt-1">+{growth.toFixed(1)}%</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Spending & Enrollment Over Time</h2>
              <TrendLineChart data={yearlyTrends} />
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Year-by-Year Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {yearlyTrends.map((y) => (
                  <div key={y.year} className="bg-muted/30 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">{y.year}</p>
                    <p className="font-mono text-sm text-foreground mt-1">{formatCurrency(y.totalSpending, true)}</p>
                    <p className="font-mono text-xs text-success mt-1">{formatNumber(y.enrollees, true)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Trends;