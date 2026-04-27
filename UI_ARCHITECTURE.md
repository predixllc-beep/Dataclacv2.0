# UI Architecture

## Philosophy
The UI is NOT a passive frontend; it is a live Control Plane for an autonomous hedge-fund trading sysetm. Every component in the backend is observable and controllable from this surface.

## Stack
- **Frontend**: React + Tailwind + Vite
- **Real-Time Layer**: WebSockets (bidirectional streaming)
- **Backend Bridge**: Python WebSocket Gateway + Command Router

## Modules
- `ui/backend_bridge`: The Node.js/Vite glue to the Python execution engine.
- `ui/state_streamer`: Synchronizes Backend Event Store to Frontend Redux/Context state.
- `ui/modules`:
  - `agents_dashboard`: View reasoning logs, override decisions, pause agents.
  - `execution_dashboard`: Live orders, OMS/EMS state, cancel/modify.
  - `risk_dashboard`: Kill switches, exposure limits.
  - `portfolio_dashboard`: Real-time M2M PnL.
  - `system_health_dashboard`: Latency, failovers.
  - `trading_terminal`: Institutional manual override mode.

## State Binding
The UI maintains a replica of the `EventStore` state. It listens to `order_created`, `order_filled`, `pnl_update`, etc., and hydrates the DOM iteratively in <100ms.
