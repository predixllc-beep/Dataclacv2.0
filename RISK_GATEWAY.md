# Risk Gateway

## Principles
Every action traverses `risk_gateway.py`. It is a synchronous blocking layer. If pre-trade or post-trade checks fail, execution is halted immediately.

## Capabilities
- **Pre-trade**: Position sizing, absolute delta, max drawdown limits, and fat-finger checks.
- **Post-trade**: Concentration risk, total firm margin locked, and execution slippage drift.
- **Liquidity Stress**: Ensures firm isn't holding 80% of open interest in an illiquid market.
- **Anomaly Detection**: Flags sudden oracle breaks.
