import logging

class FailoverEngine:
    """ Handles 504 Gateway Timeouts by demoting preferred exchanges. """
    def __init__(self):
        self.logger = logging.getLogger("FailoverEngine")
        
    def demote_venue(self, venue: str):
        self.logger.critical(f"Demoting {venue} from routing table due to health check failure.")
