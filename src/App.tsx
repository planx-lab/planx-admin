import { LayoutDashboard, Activity, Workflow, Cpu } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { SummaryCards, RecentExecutions } from '@/components/dashboard/Dashboard';
import { ExecutionsPage } from '@/components/executions/ExecutionsPage';
import { PipelinesPage } from '@/components/pipelines/PipelinesPage';
import { PluginsPage } from '@/components/plugins/PluginsPage';

const tabs = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'executions' as const, label: 'Executions', icon: Activity },
  { id: 'pipelines' as const, label: 'Pipelines', icon: Workflow },
  { id: 'plugins' as const, label: 'Plugins', icon: Cpu },
];

export function App() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const tenantId = useUIStore((s) => s.tenantId);
  const setTenantId = useUIStore((s) => s.setTenantId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 shrink-0 border-b border-border bg-surface flex items-center px-5 gap-4">
        <span className="font-semibold text-sm text-foreground font-mono tracking-tight">
          Planx <span className="text-accent">Admin</span>
        </span>
        <div className="flex-1" />
        <input
          type="text"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          placeholder="Tenant ID"
          className="bg-transparent text-xs text-foreground/40 placeholder:text-foreground/20 focus:outline-none w-32 text-right"
        />
      </header>

      <nav className="border-b border-border bg-surface/50">
        <div className="flex px-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/40 hover:text-foreground/60'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <SummaryCards />
            <RecentExecutions />
          </div>
        )}
        {activeTab === 'executions' && <ExecutionsPage />}
        {activeTab === 'pipelines' && <PipelinesPage />}
        {activeTab === 'plugins' && <PluginsPage />}
      </main>
    </div>
  );
}

export default App;
