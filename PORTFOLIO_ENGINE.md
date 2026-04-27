# Portfolio Engine

## Principles
Absolute precision over the accounting ledger is required for prediction markets. 

## Components
- `ledger.py`: Immutable append-only log of realized fills.
- `pnl_engine.py`: Calculates M2M (Mark to Market), Unrealized, and Realized PnL.
- `exposure_book.py`: Real-time greek delta/capital exposure metrics.
- `settlement_reconciliation.py`: Validates physical payout hits the bank upon event resolution.

## Features Added
- Ambiguity-free zero-trust capital accounting.
- Separation of locked margin vs freely available deploy capital.
