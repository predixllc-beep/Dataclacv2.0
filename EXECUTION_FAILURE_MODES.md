# Execution Failure Modes

| Failure Mode | Impact | Mitigation Strategy |
|--------------|--------|---------------------|
| **Orphaned Order** | High PnL risk. Order stays alive but backend crashed. | Exchange-level Cancel-On-Disconnect (COD) where supported. If not, startup routine MUST cancel all active orders before trading begins. |
| **Duplicate Execution** | Double exposure. Agent thinks order failed but it filled. | Idempotency Keys natively on the exchange API. Never retry an order without checking fill status. |
| **Inventory Drift** | Expected risk is vastly misaligned with real holdings. | Check theoretical index against real exchange REST portfolio every 10 minutes. If drift > 2%, halt trading. |
| **Spread Crossing / Slippage** | AMM slippage causes entry at -20% EV. | Absolute limit prices and strict `amount_out_min` parameters submitted to the smart contract. |
| **Market Anomaly / Drain** | Fake news triggers a run, draining our MM liquidity. | `AnomalyGuard` triggers circuit breaker if localized event vol spikes 10X in 5 seconds. |
