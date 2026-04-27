# Observability & Monitoring

## Architecture
All systems report to unified metrics layers to ensure zero blind spots during real-money operations.

1. **Prometheus Metrics**
   - Active tracking of:
     - `order_latency_ms`: Time taken from decision to exchange ACK.
     - `inventory_exposure`: Net delta risk.
     - `tick_to_trade_ms`: Reaction time metrics.
     - `agent_confidence_score`: Average confidence per agent decisions.
2. **Structured Logging (JSON)**
   - All Python logs output JSON conforming to institutional standards, tracking `Correlation ID`, `Agent ID`, `Action`, and `Status`.

3. **Latency Monitor**
   - Background threads constantly ping exchange websockets directly to monitor line quality, flagging `UNHEALTHY` if pings drag beyond bounds, terminating trading modes.
