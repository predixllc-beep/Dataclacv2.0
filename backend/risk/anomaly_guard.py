import logging

class AnomalyGuard:
    \"\"\"
    Detects oracle manipulation or massive flash crashes (e.g. 99c to 1c in 1 second).
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("AnomalyGuard")
        
    def check_price_delta(self, old_px: float, new_px: float) -> bool:
        if abs(new_px - old_px) > 0.40:  # 40 cent swing instantly
            self.logger.warning("Price anomaly guarded!")
            return False
        return True
