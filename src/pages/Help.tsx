import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Where does the data come from?", a: "Data is sourced from the sdud and state_population tables, with forecasts from state_quarter_forecast." },
  { q: "How is per-capita spending calculated?", a: "Per-capita = total Medicaid spending ÷ state population for the selected year." },
  { q: "What does QoQ mean on the heat map?", a: "Quarter-over-Quarter change: (latest quarter − previous quarter) ÷ previous quarter, expressed as a percent." },
  { q: "How are forecast values generated?", a: "Forecast columns (pred_q1–pred_q4) are loaded directly from the state_quarter_forecast table." },
];

const Help = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Help</h1>
              <p className="text-sm text-muted-foreground">FAQs and dashboard guidance</p>
            </div>
          </div>
        </header>
        <div className="p-6 max-w-3xl">
          <div className="bg-card rounded-xl border border-border p-6">
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default Help;