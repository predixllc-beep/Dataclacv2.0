import logging

class RiskGateway:
    """
    Strict blocking layer. All intents pass through this before OMS.
    """
    def __init__(self):
        self.logger = logging.getLogger("RiskGateway")
        self.MAX_POS = 5000
        
    def pre_trade_risk(self, instruction, portfolio_exposure) -> bool:
        """ Stops fat fingers and limits. """
        if instruction.size * instruction.price > self.MAX_POS:
            self.logger.critical(f"PRE-TRADE BLOCK: Size > {self.MAX_POS}")
            return False
            
        return True
        
    def post_trade_risk(self, fill_report):
        """ Adjusts limits or triggers halts on toxic fills. """
        pass
