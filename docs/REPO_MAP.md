# Repository Map

## Structure
`core/` (Mapped as `backend/` in current integration)
- `agents/`: Autonomous decision-makers (Supervisor, MM, Arb, Signal, Risk, Portfolio)
- `connectors/`: Raw exchange API wrappers (Polymarket, Kalshi, Predict.fun)
- `data_feeds/`: External truth and odds ingestion (OddsPipe, Sportradar)
- `risk/`: Pre-trade and post-trade safety (KillSwitch, Exposure, Anomaly)
- `strategies/`: Trading specific logic (StatArb, EventArb, MM)
- `monitoring/`: Real-time observability (Prometheus, Latency, Health)
- `backtester/`: Simulation engine
- `oms/`: Order Management System
- `ems/`: Execution Management System

`docs/`: Architecture and audit artifacts
`tests/`: Test suite for critical components
`src/`: Original frontend files (React dashboard)
