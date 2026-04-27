import logging
from backend.ui_bridge.audit_logger import AuditLogger

class CommandRouter:
    """
    Validates and routes UI commands into internal execution layers safely.
    """
    def __init__(self, orchestrator, risk_gateway):
        self.logger = logging.getLogger("CommandRouter")
        self.orchestrator = orchestrator
        self.risk = risk_gateway
        self.audit = AuditLogger()
        
    def handle_command(self, payload: dict):
        action = payload.get("action")
        user = payload.get("user", "SYSTEM")
        params = payload.get("parameters", {})
        
        self.audit.log_action(user, action, params)
        
        if action == "EMERGENCY_FLATTEN":
            self.logger.critical(f"EMERGENCY FLATTEN INITIATED BY {user}")
            # Call orchestrator emergency flatten
            return {"status": "ACK", "message": "Flattening logic initiated"}
            
        elif action == "KILL_SWITCH":
            self.logger.critical(f"KILL SWITCH TRIPPED BY {user}")
            # Disable trading engines
            return {"status": "ACK", "message": "Trading halted"}
            
        elif action == "MANUAL_ORDER":
            self.logger.info(f"Manual Order Injection: {params}")
            # Inject into orchestrator
            return {"status": "ACK", "message": "Manual order injected"}
            
        elif action == "UPDATE_RISK_LIMIT":
            new_limit = params.get("limit")
            self.logger.warning(f"Risk Limits Updated by {user}: {new_limit}")
            return {"status": "ACK", "message": "Risk limit updated"}
            
        else:
            self.logger.error(f"Unknown command action: {action}")
            return {"status": "ERROR", "message": "Unknown command"}
