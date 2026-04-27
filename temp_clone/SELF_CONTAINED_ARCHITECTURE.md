# Self-Contained Architecture

## Monolithic but Modular Quant Operating System
This architecture ensures that the repository (`Polyclaw`) has zero critical external runtime dependencies (no Hummingbot, no Freqtrade, no proprietary third-party execution grids) aside from standard library and minimal infrastructural Python packages.

### Layers:
1. **Agents (`/backend/agents`)**: Autonomous reasoning layer handling signal evaluation and consensus (Custom built, zero external dependencies).
2. **Signals (`/backend/data_feeds`)**: Normalization of external truth without relying on heavy third-party parsing libraries.
3. **Risk (`/backend/risk`)**: PnL Guards, Kill Switches, and Exposure limiters hardcoded.
4. **Execution (`/backend/execution`)**: Completely in-house OMS (Order Management System) and EMS (Execution Management System).
5. **Connectors (`/backend/connectors`)**: CCXT-inspired abstract base classes implementing native REST/WS connections to Polymarket, Kalshi, etc. without needing CCXT itself.
6. **Portfolio (`/backend/portfolio`)**: Ledger and accounting engines internally tracking PnL and inventory drift.
7. **Monitoring (`/backend/monitoring`)**: Health and latency monitoring. Prometheus hooks included, but core logic is standalone.

By internalizing the architecture, Polyclaw achieves sub-millisecond local execution routing, zero vendor lock-in, and total structural transparency.
