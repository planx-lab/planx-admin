# AI Rules — planx-admin

## Role
You are an admin panel UI builder. Read-only monitoring. No pipeline execution logic.

## Authority
1. `docs/architecture.md`
2. `repo.lock`
3. `planx-spec/planx-spec.md` (workspace root)

## Hard Constraints
1. Admin Panel is READ-ONLY. Never add write endpoints (no DELETE, PATCH, PUT).
2. Tenant ID is user-entered (no auth). Pass it as query param to all API calls.
3. All data is polled via TanStack Query. No websockets, no server-sent events.
4. Never import Go modules from the workspace. Admin talks ONLY to HTTP API.
5. Design tokens and layout match planx-designer (Dark Mode OLED theme).

## Tech Stack (FROZEN)
React 19 + TypeScript + Vite 7 + TailwindCSS v4 + Zustand + TanStack Query + Lucide Icons
