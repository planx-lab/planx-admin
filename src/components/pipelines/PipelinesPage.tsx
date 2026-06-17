import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { usePipelines } from '@/hooks/queries';
import type { PipelineSummary, ExecutionRecord } from '@/types/api';
import { api } from '@/api/client';

export function PipelinesPage() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { data, isLoading, error } = usePipelines(page);

  const toggleExpand = async (pipelineId: string) => {
    if (expanded === pipelineId) {
      setExpanded(null);
      return;
    }
    setExpanded(pipelineId);
    setExecutions([]);
    setLoadingDetail(true);
    try {
      await api.get<PipelineSummary>(
        `/pipelines/${pipelineId}?tenantId=${localStorage.getItem('planx-admin:tenant') ?? 'default-tenant'}`,
      );
      // Fetch executions for this pipeline
      const execs = await api.get<{ executions: ExecutionRecord[] }>(
        `/executions?tenantId=${localStorage.getItem('planx-admin:tenant') ?? 'default-tenant'}`,
      );
      const filtered = execs.executions
        ?.filter((e) => e.pipelineId === pipelineId)
        .slice(0, 5) ?? [];
      setExecutions(filtered);
    } catch {
      setExecutions([]);
    }
    setLoadingDetail(false);
  };

  if (error) {
    return <div className="p-8 text-center"><p className="text-destructive">Failed to load pipelines.</p></div>;
  }

  const pipelines = data?.pipelines ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  // Status badge (inline)
  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-foreground/40 bg-foreground/5',
      RUNNING: 'text-blue bg-blue/10',
      SUCCEEDED: 'text-accent bg-accent/10',
      FAILED: 'text-destructive bg-destructive/10',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? colors.PENDING}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-foreground/40 text-xs">
                <th className="text-left px-5 py-2.5 font-medium w-8" />
                <th className="text-left px-4 py-2.5 font-medium">Name</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={4} className="px-5 py-12 text-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent mx-auto" />
                </td></tr>
              )}
              {!isLoading && pipelines.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-foreground/30">
                  No pipelines yet
                </td></tr>
              )}
              {pipelines.map((p) => (
                <>
                  <tr
                    key={p.pipelineId}
                    onClick={() => toggleExpand(p.pipelineId)}
                    className="border-b border-border/50 hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      {expanded === p.pipelineId ? <ChevronDown size={14} className="text-foreground/40" /> : <ChevronRight size={14} className="text-foreground/40" />}
                    </td>
                    <td className="px-4 py-3 text-foreground/80 font-medium">{p.pipelineId}</td>
                    <td className="px-4 py-3">{statusBadge(p.lastStatus)}</td>
                    <td className="px-4 py-3 text-foreground/40 text-xs">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                  {/* Expanded: recent executions */}
                  {expanded === p.pipelineId && (
                    <tr key={`${p.pipelineId}-detail`}>
                      <td colSpan={4} className="bg-muted/30 px-8 py-3">
                        {loadingDetail ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        ) : executions.length === 0 ? (
                          <p className="text-xs text-foreground/30">No executions</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-foreground/40 mb-2">Recent executions:</p>
                            {executions.map((e) => (
                              <div key={e.id} className="flex items-center gap-4 text-xs">
                                <span className="font-mono text-foreground/40 w-20 truncate">{e.id.slice(0, 8)}…</span>
                                {statusBadge(e.status)}
                                <span className="text-foreground/30">{new Date(e.createdAt).toLocaleTimeString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground/40">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronDown size={16} className="rotate-90" />
          </button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
