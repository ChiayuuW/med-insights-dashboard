import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Settings = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Dashboard preferences</p>
            </div>
          </div>
        </header>
        <div className="p-6 max-w-2xl space-y-4">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Display</h2>
            <div className="flex items-center justify-between">
              <Label>Compact number formatting</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show live data badge</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Animations</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Defaults</h2>
            <div className="space-y-2">
              <Label>Default year</Label>
              <Input defaultValue="2025" />
            </div>
            <div className="space-y-2">
              <Label>Default state</Label>
              <Input defaultValue="All States" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </SidebarProvider>
);

export default Settings;