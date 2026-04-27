import logging

class PnLEngine:
    def __init__(self):
        self.logger = logging.getLogger("PnLEngine")
        
    def calculate_mark_to_market(self, inventory: dict, latest_prices: dict) -> float:
        unrealized = 0.0
        for asset, size in inventory.items():
            current_px = latest_prices.get(asset, 0)
            unrealized += (size * current_px)
        return unrealized
        
    def book_realized(self, trade_pnl: float):
        self.logger.info(f"Booked Realized PnL: ${trade_pnl:.2f}")
