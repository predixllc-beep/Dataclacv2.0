import logging

class PNLGuard:
    \"\"\"
    Monitors high-water mark and realized PnL to prevent revenge trading algorithms.
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("PNLGuard")
        self.hwm = 0.0
        
    def validate_pnl_trajectory(self, current_pnl: float):
        if current_pnl < (self.hwm - 1000): # $1000 sudden drawdown
            self.logger.critical("Massive drawdown detected. Calling for Supervisor intervention.")
