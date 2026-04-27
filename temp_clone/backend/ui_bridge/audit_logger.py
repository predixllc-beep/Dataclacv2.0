import logging
import json
import time

class AuditLogger:
    """
    Immutable audit log for all control plane commands.
    """
    def __init__(self, filename="audit_log/admin_commands.log"):
        self.logger = logging.getLogger("AuditLogger")
        self.filename = filename
        
        # Ensure dir
        import os
        os.makedirs(os.path.dirname(self.filename), exist_ok=True)
        
    def log_action(self, user: str, action: str, details: dict):
        record = {
            "timestamp": time.time(),
            "user": user,
            "action": action,
            "details": details
        }
        with open(self.filename, 'a') as f:
            f.write(json.dumps(record) + "\n")
        self.logger.info(f"[AUDIT] {user} executed {action}")
