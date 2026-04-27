# Execution Management System (EMS) Design

## Philosophy
The EMS translates the high-level intent from the OMS into exchange-specific API calls. It handles all network-heavy tasks, retries, and exchange mapping.

## Architecture
- **Unified Adapter**: Interfaces with `UnifiedMarketRouter` and `ExchangeBase`.
- **Idempotency Mapping**: Maps internal OMS UUIDs to Exchange-provided Order IDs.
- **Retry Logic / TCP Guard**: Handles socket drops and REST timeouts. If an order fails to ACK due to network drop, the EMS enters an `UNKNOWN` state resolution logic (querying the exchange via REST to confirm if the order hit the matching engine before reporting back to OMS).

## Components
- `ExecutionManager`: Main loop for routing.
- `FillReconciliation`: Async task periodically grabbing actual trades from Kalshi/Poly and syncing with OMS internal partial fills to detect any "Phantom Fills".
