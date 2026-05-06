import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Database, CheckCircle2 } from "lucide-react";

const sources = [
  { name: "sdud", desc: "State Drug Utilization Data — quarterly Medicaid prescription claims by state.", status: "Connected", rows: "1.2M" },
  { name: "state_population", desc: "Annual state population estimates used for per-capita calculations.", status: "Connected", rows: "357" },
  { name: "state_quarter_forecast", desc: "Quarterly actuals and pred_q1–pred_q4 forecast values per state.", status: "Connected", rows: "51" },
];

const DataSources = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Sources</h1>
              <p className="text-sm text-muted-foreground">Tables powering this dashboard</p>
            </div>
          </div>
        </header>
        <div className="p-6 grid gap-4">
          {sources.map((s) => (
            <div key={s.name} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-foreground font-semibold">{s.name}</code>
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="h-3 w-3" /> {s.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Rows</p>
                <p className="font-mono text-foreground">{s.rows}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default DataSources;