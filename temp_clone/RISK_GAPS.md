# Risk Gaps

## 1. Zero Exposure Control (CRITICAL)
- **Problem**: There are no position limits defined per event, market, or globally. The system could exhaust capital on a single correlated asset class.
- **Solution**: Implement `position_limits.py` to enforce strict size caps at the portfolio level before routing appropriately.

## 2. No Max Downside / Kill Switch (CRITICAL)
- **Problem**: In case of a black swan or an erroneous agent loop (fat finger), there is no hardware or software kill switch to cancel all resting orders and pause trading.
- **Solution**: Implement `kill_switch.py`. Any failure of health checks automatically triggers `cancel_all` across all connecters.

## 3. Lack of Slippage Guards (HIGH)
- **Problem**: Market orders or crossing the spread with huge sizes will result in terrible fills on automated AMMs.
- **Solution**: Native implementation of `slippage_controls.py` ensuring limit orders are used with bounded threshold execution logic.

## 4. No Wash Trading / Self-Crossing Prevention (HIGH)
- **Problem**: Multiple agents (e.g., an Arb Agent and a Yield Agent) might accidentally trade against each other, racking up fees.
- **Solution**: Implement cross-agent orchestration in `supervisor_agent.py` to net internal orders before executing on venues.

## 5. Security & Key Leakage (HIGH)
- **Problem**: API keys currently input via insecure UI without encryption at rest.
- **Solution**: API Key Isolation logic with signed executions via generic key-signing enclaves.
