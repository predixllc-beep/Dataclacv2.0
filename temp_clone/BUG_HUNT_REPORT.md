# Bug Hunt & Failure Analysis

1. **Bug: Kalshi Cents vs Polymarket USD**
   - Context: Kalshi trades in cents (1 to 100), Polymarket prices in decimals (0.01 to 1.00).
   - Risk: If an arb agent passes `0.50` EV to Kalshi, Kalshi rejects it or executes at `1 cent` instead of `50 cents`.
   - Resolution: `UnifiedMarketRouter` must have strict currency formatting decorators.

2. **Bug: Nonce Conflict on EVM (Polymarket)**
   - Context: Sending rapid consecutive orders on Polygon will trigger `Replacement transaction underpriced` or `Nonce too low`.
   - Risk: 90% of trades will drop under load.
   - Resolution: Implement asynchronous NonceManager with Redis locking in `polymarket_connector.py`.

3. **Bug: Fake/Stale Data Assumption**
   - Context: In `App.tsx`, dashboard blindly trusts `mock_feed`. Backend could assume API latency is ~10ms.
   - Risk: If latency spikes to 2000ms, the strategy still tries to arb an opportunity that is long gone.
   - Resolution: Tag every signal with `timestamp_originated` and discard if older than `latency_threshold`.
