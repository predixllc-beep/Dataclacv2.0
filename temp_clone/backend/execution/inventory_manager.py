import logging

class InventoryManager:
    """
    Tracks portfolio ledger and dynamically adjusts theoretical exposure across all integrated markets.
    """
    def __init__(self):
        self.logger = logging.getLogger("InventoryManager")
        self.holdings = {} # mapping of canonical_id -> size_held
        
    def add_fill(self, canonical_id: str, side: str, qty: float):
        if canonical_id not in self.holdings:
            self.holdings[canonical_id] = {"long": 0.0, "short": 0.0}
            
        if side.upper() == "BUY":
            self.holdings[canonical_id]["long"] += qty
        elif side.upper() == "SELL":
            self.holdings[canonical_id]["short"] += qty
            
        self.logger.info(f"Inventory Adjusted: {canonical_id} -> {self.holdings[canonical_id]}")
        
    def get_skew_for_event(self, canonical_id: str) -> float:
        """
        Returns a skew scalar. If heavily long, returns negative value to adjust mm algorithm to quote skewed towards offloading inventory.
        Inspired by Hummingbot's inventory skew logic.
        """
        pos = self.holdings.get(canonical_id, {"long": 0.0, "short": 0.0})
        net = pos["long"] - pos["short"]
        
        # simple linear skew logic
        if net > 1000:
            return -0.05 # Skew bids down by 5%
        elif net < -1000:
            return 0.05 # Skew asks up by 5%
            
        return 0.0
