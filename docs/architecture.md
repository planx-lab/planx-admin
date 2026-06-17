# Planx Admin — Architecture

## Purpose

Admin monitoring panel for Planx 4.0. Reads pipeline execution status, plugin pool stats, and system health from the Control Plane API. Does NOT execute pipelines or modify engine state.

## Data Flow

```
Control Plane API (planx-engine :8080)
  ↓ HTTP JSON
TanStack Query (auto-poll: 5s-30s)
  ↓
React Components (dashboard / executions / pipelines / plugins)
```

## Component Architecture

4 tabs, 1 layout:

```
+--------------------------------------------------+
| Header: Planx Admin          Tenant ID: [input]   |
+--------------------------------------------------+
| Tab bar: [Dashboard] [Executions] [Pipelines] [Plugins] |
+--------------------------------------------------+
|                                                    |
| Tab-specific content (max-w-7xl centered)          |
+--------------------------------------------------+
```

### Pages

| Tab | Component | Data Source |
|-----|-----------|------------|
| Dashboard | `SummaryCards` + `RecentExecutions` | usePipelines, useExecutions, usePlugins, useHealth |
| Executions | `ExecutionsPage` (paginated table + status filter) | useExecutions(page, statusFilter) |
| Pipelines | `PipelinesPage` (expandable rows → recent executions) | usePipelines(page) |
| Plugins | `PluginsPage` (card grid + pool bars) | usePlugins |

## State Management

- **TanStack Query**: Server state (executions, pipelines, plugins, health) — cached, auto-polled.
- **Zustand**: UI state (active tab, tenant ID).
- No local draft persistence (admin is read-only).

## API

Vite proxy rewrites `/api/*` → `http://localhost:8080/*`.

Endpoints consumed:
- `GET /executions?tenantId=&page=&pageSize=&status=`
- `GET /pipelines?tenantId=&page=&pageSize=`
- `GET /pipelines/{id}?tenantId=`
- `GET /plugins`
- `GET /healthz`
