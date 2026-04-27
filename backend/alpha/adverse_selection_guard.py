import logging

class AdverseSelectionGuard:
    """
    Prevents resting limit orders from being picked off right before market movement.
    """
    def __init__(self):
        self.logger = logging.getLogger("AdverseSelectionGuard")
        
    def should_pull_quotes(self, volatility_spike: bool) -> bool:
        if volatility_spike:
            self.logger.warning("Volatility Spike detected. Pulling quotes to prevent adverse selection.")
            return True
        return False
