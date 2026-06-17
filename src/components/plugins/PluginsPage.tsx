import { usePlugins } from '@/hooks/queries';
import { Cpu } from 'lucide-react';
import type { PluginDescriptor } from '@/types/api';

const typeColors: Record<string, string> = {
  source: 'border-blue/30 bg-blue/10',
  processor: 'border-amber/30 bg-amber/10',
  sink: 'border-emerald/30 bg-emerald/10',
};

export function PluginsPage() {
  const { data, isLoading, error } = usePlugins();

  if (error) {
    return <div className="p-8 text-center"><p className="text-destructive">Failed to load plugins.</p></div>;
  }

  const plugins = data?.plugins ?? [];

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 h-40 animate-pulse" />
          ))}
        </div>
      )}
      {!isLoading && plugins.length === 0 && (
        <div className="p-12 text-center text-foreground/30">No plugins loaded</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map((plugin) => (
          <PluginCard key={plugin.name} plugin={plugin} />
        ))}
      </div>
    </div>
  );
}

function PluginCard({ plugin }: { plugin: PluginDescriptor }) {
  const pool = plugin.pool;
  return (
    <div className={`rounded-xl border-2 p-5 ${typeColors[plugin.type]}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{plugin.name}</h3>
          <span className="text-[10px] uppercase tracking-wider text-foreground/40">{plugin.type} · v{plugin.version}</span>
        </div>
        <Cpu size={20} className="text-foreground/20" />
      </div>

      {pool && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-foreground/50">
            <span>Pool: {pool.active + pool.idle}/{pool.max}</span>
            <span>Active: {pool.active}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${Math.min(100, ((pool.active + pool.idle) / Math.max(1, pool.max)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-foreground/30">
            <span>Min idle: {pool.minIdle}</span>
            <span>Max idle: {pool.maxIdle}</span>
          </div>
        </div>
      )}
    </div>
  );
}
