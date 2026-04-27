# WebSocket Event Schema

## Philosophy
Strict JSON schema ensuring typed bidirectional communication between the Python trading layer and the React Control Plane.

## Server-to-Client Events (Telemetry)

### `system_health`
```json
{
  "event": "system_health",
  "payload": {
    "status": "GREEN",
    "latency_poly_ms": 45.2,
    "latency_kalshi_ms": 112.1,
    "active_agents": 4
  }
}
```

### `order_update`
```json
{
  "event": "order_update",
  "payload": {
    "internal_id": "uuid-1234",
    "symbol": "TRUMP_WIN",
    "state": "PARTIAL_FILL",
    "filled_size": 2500.0,
    "total_size": 5000.0
  }
}
```

### `pnl_update`
```json
{
  "event": "pnl_update",
  "payload": {
    "unrealized_usd": 1450.25,
    "realized_usd": 402.10,
    "net_delta_usd": 8500.0
  }
}
```

## Client-to-Server Events (Commands)

### `admin_command`
```json
{
  "event": "admin_command",
  "signature": "mock_jwt_or_auth_token",
  "timestamp": 1698765432,
  "payload": {
    "action": "HALT_STRATEGY",
    "target": "EventArb",
    "parameters": {"reason": "Manual Intervention"}
  }
}
```

### `manual_order`
```json
{
  "event": "manual_order",
  "signature": "...",
  "payload": {
    "symbol": "FED_CUT_MARCH",
    "side": "BUY_Y",
    "size": 1000,
    "price": 0.45,
    "order_type": "LIMIT"
  }
}
```
