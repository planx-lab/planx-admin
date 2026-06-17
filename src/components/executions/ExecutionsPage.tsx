import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Circle, Timer } from 'lucide-react';
import { useExecutions } from '@/hooks/queries';
import type { ExecutionRecord } from '@/types/api';

const STATUSES: (ExecutionRecord['status'] | '')[] = ['', 'PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED'];

export function ExecutionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ExecutionRecord['status'] | ''>('');
  const { data, isLoading, error } = useExecutions(page, statusFilter);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Failed to load executions.</p>
      </div>
    );
  }

  const executions = data?.executions ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-foreground/40">Filter:</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              s === statusFilter
                ? 'bg-accent/20 text-accent'
                : 'bg-surface text-foreground/50 hover:text-foreground/80'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
        <span className="ml-auto text-xs text-foreground/40">
          {total} total
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-foreground/40 text-xs">
                <th className="text-left px-5 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Pipeline</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Error</th>
                <th className="text-left px-4 py-2.5 font-medium">Created</th>
                <th className="text-left px-4 py-2.5 font-medium">Finished</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto" />
                  </td>
                </tr>
              )}
              {!isLoading && executions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-foreground/30">
                    No executions found
                  </td>
                </tr>
              )}
              {executions.map((e) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-2.5 font-mono text-xs text-foreground/50">
                    {e.id.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-2.5 text-foreground/80">{e.pipelineId}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-destructive max-w-[200px] truncate" title={e.error}>
                    {e.error ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-foreground/40 text-xs">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-foreground/40 text-xs">
                    {e.finishedAt ? new Date(e.finishedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground/40">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
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
