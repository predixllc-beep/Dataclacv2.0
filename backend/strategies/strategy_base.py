import logging

class StrategyBase:
    """
    Freqtrade-inspired base class for all quantitative strategies.
    Standardizes lifecycle and dataframe/signal generation over logic.
    """
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
        
    def populate_indicators(self, data: dict) -> dict:
        """ Extracts edges or statistical anomalies from unified data feeds. """
        return data
        
    def populate_signals(self, data: dict) -> list:
        """ Returns unified signal objects: [{action: 'BUY', confidence: 0.8...}] """
        raise NotImplementedError
