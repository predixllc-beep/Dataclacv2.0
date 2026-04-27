# OMS Architecture

## Principles
The internal Order Management System (OMS) isolates trading intent from execution reality. It represents the "book of record" for what the firm expects to execute.

## Components
- `order_manager.py`: Central repository tracking Parent and Child order states.
- `order_state_machine.py`: Dictates strict allowable transitions (e.g., PENDING -> SUBMITTED -> PARTIAL_FILL -> FILLED).
- `order_validator.py`: Pre-trade checks against boundaries before EMS handover.
- `order_router.py`: Determines pathing to EMS and strategy assignment.
- `execution_instructions.py`: Strong typing for Limit, Maker, Taker, Post-Only, Reduce-Only enums.

## Features Added
- Parent/Child order splitting for institutional size.
- Cancel/Replace pipeline to optimize rate limits.
- Stale order protection (TTL expiration).
- Duplicate sequence guards.
