# Internalized Imports & Patterns from Open Source

We have studied industry standard open source platforms (Hummingbot, Freqtrade, CCXT) and internalized their best concepts natively into `Polyclaw`, omitting their heavy runtime requirements.

| Source Platform | Pattern Borrowed | Internalized Implementation |
|-----------------|------------------|-----------------------------|
| **CCXT** | Unified Exchange Abstraction | Built `ExchangeBase` class (`backend/connectors/exchange_base.py`) standardizing `fetch_orderbook`, `create_order`, `cancel_order` with uniform return objects. |
| **Hummingbot** | Inventory Skew Logic | Built `MarketMakingStrategy` calculating skew bid/ask off target inventory, keeping balance localized without Cython dependencies. |
| **Hummingbot** | Order Refresh / Active Orders | Implemented native `OrderManager` and `ExecutionManager` handling TTL (Time-To-Live) and cancel/replace loops safely. |
| **Freqtrade** | Dataframes + Strategy Interface | Adapted `StrategyBase` pattern where each strategy implements `populate_indicators()`, `populate_buy_trend()`, and `populate_sell_trend()`. |
| **Freqtrade** | Stoploss & Risk Management | Implemented `PNLGuard` and `ExposureEngine` locally without SQLite tight-coupling. |

All borrowed patterns were rewritten natively in Python, minimizing package creep and aligning tightly with prediction market idiosyncrasies (Event shares vs Crypto tokens).
