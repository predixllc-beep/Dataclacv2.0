import logging
from backend.portfolio.pnl_engine import PnLEngine
from backend.portfolio.exposure_book import ExposureBook
from backend.portfolio.accounting import PortfolioAccounting

class Ledger:
    """
    Absolute Source of Truth for Capital and Inventory.
    """
    def __init__(self):
        self.logger = logging.getLogger("PortfolioLedger")
        self.accounting = PortfolioAccounting()
        self.pnl = PnLEngine()
        self.exposure = ExposureBook()
        self.trade_history = []
        
    def log_trade(self, canonical_id: str, size: float, price: float, side: str):
        doc = {"id": canonical_id, "size": size, "price": price, "side": side}
        self.trade_history.append(doc)
        
        exposure_val = size * price if side.startswith("BUY") else -(size * price)
        self.exposure.update_delta(canonical_id, exposure_val)
