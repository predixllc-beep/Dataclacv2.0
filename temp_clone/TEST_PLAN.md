# Master Test Plan

## 1. Unit Tests
- `test_risk.py`: Assert that position limits correctly reject `size > max_allowed`.
- `test_anomaly.py`: Assert that a violent price swing returns `False` for valid trade.

## 2. Integration Tests
- `test_unified_router.py`: Ensure that a mocked Poly and Kalshi connector correctly parse a unified route instruction without syntax errors.
- `test_agent_consensus.py`: Feed conflicting signals to `SupervisorAgent` and assert it defaults to `SAFETY_FIRST` (pass/no-trade).

## 3. Exchange Simulation (Backtester)
- Create a `BacktestEngine` that emulates L2 latency and rejection logic.
- Feed 24 hours of Historical Orderbook Tick Data into the engine and verify the statistical arb agent operates smoothly.

## 4. Failure Injection
- Deliberately cut network connectivity mid-trade (mocked intercept) and verify the `OrderManager` correctly flags as `UNKNOWN_STATE` and alerts human intervention, rather than dead-re-trying.
