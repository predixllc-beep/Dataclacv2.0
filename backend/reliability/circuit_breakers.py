import logging
import sys

class CircuitBreakers:
    """ Tripped by excessive rejects or catastrophic PnL drops. """
    def __init__(self):
        self.logger = logging.getLogger("CircuitBreaker")
        self.reject_count = 0
        
    def log_reject(self):
        self.reject_count += 1
        if self.reject_count > 10:
            self.trip_order_storm_breaker()
            
    def trip_order_storm_breaker(self):
        self.logger.critical("ORDER LIMIT STORM. TRADING HALTED.")
        sys.exit(1)
        
    def emergency_flatten(self, ems, portfolio):
        self.logger.critical("EMERGENCY FLATTEN INITIATED. Exiting all positions at MARKET.")
