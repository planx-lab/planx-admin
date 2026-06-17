import { Activity, Zap, Plug, Heart, Clock, CheckCircle2, XCircle, Circle, Timer } from 'lucide-react';
import { useExecutions, usePipelines, usePlugins, useHealth } from '@/hooks/queries';
import type { ExecutionRecord } from '@/types/api';

export function SummaryCards() {
  const pipelines = usePipelines();
  const executions = useExecutions(1, '');
  const plugins = usePlugins();
  const health = useHealth();

  const cards = [
    {
      label: 'Pipelines',
      value: pipelines.data?.total ?? '-',
      icon: Zap,
      color: 'text-blue',
      bg: 'bg-blue/10',
    },
    {
      label: 'Executions',
      value: executions.data?.total ?? '-',
      icon: Activity,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Plugins',
      value: plugins.data?.plugins.length ?? '-',
      icon: Plug,
      color: 'text-yellow',
      bg: 'bg-yellow/10',
    },
    {
      label: 'Health',
      value: health.data?.status === 'ok' ? 'OK' : 'DEGRADED',
      icon: Heart,
      color: health.data?.status === 'ok' ? 'text-accent' : 'text-destructive',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
              {label}
            </span>
            <Icon size={18} className={color} />
          </div>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export function RecentExecutions() {
  const { data, isLoading, error } = useExecutions(1, '');

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="h-40 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-destructive text-sm">Failed to load executions.</p>
      </div>
    );
  }

  const executions = data?.executions?.slice(0, 10) ?? [];

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Clock size={16} className="text-foreground/40" />
        <h3 className="text-sm font-medium text-foreground">Recent Executions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-foreground/40 text-xs">
              <th className="text-left px-5 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Pipeline</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {executions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-foreground/30">
                  No executions yet
                </td>
              </tr>
            )}
            {executions.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                <td className="px-5 py-2.5 font-mono text-xs text-foreground/50">
                  {e.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-2.5 text-foreground/80">{e.pipelineId}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-2.5 text-foreground/40">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ExecutionRecord['status'] }) {
  const config: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
    PENDING: { icon: Circle, color: 'text-foreground/40', bg: 'bg-foreground/5' },
    RUNNING: { icon: Timer, color: 'text-blue', bg: 'bg-blue/10' },
    SUCCEEDED: { icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10' },
    FAILED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };
  const c = config[status] ?? config.PENDING;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}
