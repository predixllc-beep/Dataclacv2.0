import logging
import sys

class KillSwitch:
    \"\"\"
    The ultimate circuit breaker. Shuts down the local process and emits RED alert.
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("KillSwitch")
        
    def trigger(self, reason: str):
        self.logger.critical(f"KILL SWITCH TRIGGERED: {reason}")
        # In real life, broadcast cancel_all to all WS connections before exiting
        self.logger.critical("Halt and catch fire.")
        sys.exit(1)
