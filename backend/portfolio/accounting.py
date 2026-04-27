import logging

class PortfolioAccounting:
    """
    Central Ledger for PnL, open positions, and capital lockups.
    Essential missing module added autonomously for real-money readiness.
    """
    def __init__(self):
        self.logger = logging.getLogger("PortfolioAccounting")
        self.available_capital_usd = 0.0
        self.locked_capital_usd = 0.0
        
    def allocate(self, amount: float) -> bool:
        """ Attempts to allocate capital to a new trade structure. """
        if self.available_capital_usd >= amount:
            self.available_capital_usd -= amount
            self.locked_capital_usd += amount
            return True
        return False
        
    def release(self, amount: float, pnl: float):
        """ Releases capital back to available pool upon trade close, adjusting for PnL. """
        self.locked_capital_usd -= amount
        self.available_capital_usd += (amount + pnl)
        self.logger.info(f"Released {amount} capital. Net PnL on trade: {pnl}")
