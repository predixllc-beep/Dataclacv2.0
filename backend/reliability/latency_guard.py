import logging
import time

class LatencyGuard:
    """ Ensures quotes are fresh. Banning stale flow execution. """
    def __init__(self, max_allowed_ms=250):
        self.logger = logging.getLogger("LatencyGuard")
        self.max_allowed_ms = max_allowed_ms
        
    def check_quote_age(self, quote_timestamp: float) -> bool:
        age_ms = (time.time() - quote_timestamp) * 1000
        if age_ms > self.max_allowed_ms:
            self.logger.warning(f"STALE QUOTE: Age {age_ms}ms > {self.max_allowed_ms}ms limit.")
            return False
        return True
