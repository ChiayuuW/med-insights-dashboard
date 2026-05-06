import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const reports = [
  { title: "2025 Annual Spending Report", desc: "Total spending, growth, and per-capita breakdown across all states.", date: "Feb 6, 2026" },
  { title: "Q4 2024 Forecast Accuracy", desc: "Comparison of pred_q4 vs actual quarterly results.", date: "Jan 15, 2026" },
  { title: "Top 10 States — 2025", desc: "Ranking of states by total Medicaid spending.", date: "Jan 5, 2026" },
  { title: "YoY Growth Heat Map Snapshot", desc: "State-by-state YoY change snapshot exported from the dashboard.", date: "Dec 20, 2025" },
];

const Reports = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              <p className="text-sm text-muted-foreground">Generated analytics reports</p>
            </div>
          </div>
        </header>
        <div className="p-6 grid gap-4">
          {reports.map((r) => (
            <div key={r.title} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{r.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                <p className="text-xs text-muted-foreground mt-2">{r.date}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default Reports;