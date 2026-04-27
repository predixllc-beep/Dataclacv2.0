# Admin Panel Feature Map

## Dashboard Layout

### 1. Global Navigation Bar
- Global Status Indicator (Green/Yellow/Red)
- Firm-Wide Unrealized & Realized PnL summary
- **EMERGENCY FLATTEN BUTTON** (Red, requires confirmation)
- **SYSTEM KILL SWITCH** (Halts all algorithms)

### 2. Agents Console (Workspace 1)
- Grid of active autonomous agents.
- Each agent card shows: CPU utilization, signal generation rate, confidence metrics.
- Toggle switches: `[x] Active` / `[ ] Paused`
- Log tail: Real-time scrolling reasoning logs.

### 3. OMS/EMS Terminal (Workspace 2)
- Order blotter (Table of all Parent and Child orders).
- Filter by state (`PENDING`, `FILLED`, `CANCELED`).
- Clickable rows opening order micro-details (Sub-routes, slippage impact).
- **Manual Order Entry Module**: Ticker, Size, Side, Price, Type.

### 4. Risk & Exposure (Workspace 3)
- Delta exposure heatmaps per asset.
- Value at Risk (VaR) gauges.
- Editable limits: `Max Drawdown`, `Max Position Size`.

### 5. Infrastructure (Workspace 4)
- Connector health statuses.
- API Rate Limit consumption metrics.
- Ping/Latency timeseries charts for Poly/Kalshi/Predictfun.
