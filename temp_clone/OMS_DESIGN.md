# Order Management System (OMS) Design

## Philosophy
The OMS is the local source of truth for the lifecycle of any intent to trade. It is entirely disconnected from the actual exchanges.

## Architecture
- **State Machine**: Orders move strictly through `PENDING_SUBMIT` -> `SUBMITTED` -> `ACKNOWLEDGED` -> `PARTIAL_FILL` -> `FILLED` / `CANCELED` / `REJECTED`.
- **In-Memory Ledger**: Uses dictionary mappings for $O(1)$ lookups based on internal UUIDs. (Designed to be backed by Redis in production, but runs purely in-memory as a fallback).
- **Idempotency**: Generates internal UUIDs *before* the EMS talks to the exchange, preventing duplicate executions on failure.

## Components
- `OrderManager`: Stores and updates states.
- `InventoryManager`: Hooks into OMS `FILLED` events to constantly adjust theoretical inventory vs real exchange inventory.
