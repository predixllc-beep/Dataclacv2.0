# EMS Architecture

## Principles
The Execution Management System (EMS) bridges the OMS to the physical exchanges. It hides routing latency, partial fills, slippage, and venue nuances from the higher-level logic.

## Components
- `execution_engine.py`: Event loop for active resting orders.
- `smart_router.py`: Determines optimal split across venues (e.g., Kalshi + Poly).
- `slippage_controller.py`: Computes price drift and halts fills if AMM curve shifts too violently.
- `venue_selector.py`: Best-execution ranking module.
- `execution_algorithms.py`: Microstructure execution (TWAP, VWAP, Liquidity Seeking, Iceberg).

## Features Added
- Smart split execution.
- Orderbook toxicity assessment before crossing the spread.
- Sub-ms venue routing logic.
- Opportunistic passive fill routing.
