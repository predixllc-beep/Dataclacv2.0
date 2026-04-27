# Tech Debt Report

## Current Tech Debt Items

1. **Non-Existent Unified Data Models**
   - Currently, there is zero event normalization. A Polymarket "Will inflation hit 3%?" and a Kalshi "CPI > 3.0%" event are not linked.
   - *Resolution*: Build an `EventResolutionMapper` layer to canonicalize sporting, political, and economic events into a unified hash.

2. **Missing Real-Time Websocket Interfaces**
   - Currently, no infrastructure handles L2 Orderbook streams. REST polling is too slow and will result in toxic flow.
   - *Resolution*: Implement an asynchronous websocket multiplexer with auto-reconnect and state reconciliation.

3. **Lack of Order Queueing and Retry logic**
   - Handling nonces and sequence numbers on Polygon (for Polymarket) requires strict synchronous tracking.
   - *Resolution*: Build a robust sequence/nonce manager using Redis.

4. **Hardcoded Secrets**
   - The UI tries to store API keys in `localStorage`. This is a massive security hazard.
   - *Resolution*: Move all secret management to the backend, utilizing `.env` or AWS Secrets Manager. Keys should never be touched by the frontend.

5. **No State Persistence**
   - Missing PostgreSQL/Redis stack for preserving trading history, active orders, and PnL metrics.
   - *Resolution*: Introduce a proper Database layer, logging all transitions.
