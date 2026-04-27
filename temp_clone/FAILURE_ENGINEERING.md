# Failure Engineering & Reliability

## Principles
The stack expects failure as the default state.

## Components
- `failover_engine.py`: Re-routes on exchange API 5XX errors.
- `circuit_breakers.py`: Auto-flattens portfolio or blocks trading if latency > 500ms or 3 consecutive trades slip.
- `latency_guard.py`: Measures ping to Polygon RPCs / Kalshi REST.

## Features Added
- Order Reject Storm protection (pausing if venue sends >10 rejects in 1 second).
- Quote staleness guard (banning fills on data older than 250ms).
- Emergency Flatten Mode: Hardware panic button to exit all risk at market.
