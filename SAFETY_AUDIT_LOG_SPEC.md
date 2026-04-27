# Safety & Audit Log Spec

## Philosophy
In an institutional prop-desk, NO action on the Control Plane can be silent. Every configuration change, manual execution, or algorithmic override MUST be strongly logged.

## Audit Store
All actions are logged securely. 
If an operator overrides the `Max Position Limit` from `$5,000` to `$50,000`, the system stores:
- Timestamp
- Operator ID (Role)
- Prior Value
- New Value
- Action Class (RISK_OVERRIDE)

## Access Control
- `VIEWER`: Read-only telemetry.
- `OPERATOR`: Can start/stop algorithms and manage capital.
- `ADMIN / RISK_OFFICER`: Can change physical safety limits (Max Drawdown) and utilize the Emergency Flatten features.

## Files
- `audit_log/ui_actions.log`: Fast tracking of what UI elements are engaged.
- `audit_log/admin_commands.log`: Immutable record of mutative state commands executed via the WebSocket Command Router.
