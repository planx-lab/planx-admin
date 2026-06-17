# Planx Admin

Read-only monitoring panel for Planx 4.0.

## Tabs
- **Dashboard** — Summary cards (pipelines, executions, plugins, health) + recent executions
- **Executions** — Paginated table with status filtering (PENDING / RUNNING / SUCCEEDED / FAILED)
- **Pipelines** — Expandable rows with drill-down to recent executions
- **Plugins** — Card grid with pool usage bars

## Getting Started

```bash
npm install
npm run dev
```

Set tenant ID in the top-right input field. The panel auto-polls the engine every 5-30 seconds.

## Tech Stack
React 19 · TypeScript · Vite · TailwindCSS v4 · TanStack Query · Zustand · Lucide
