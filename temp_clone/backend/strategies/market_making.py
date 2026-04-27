import logging

class MarketMakingStrategy:
    """
    Passive volume capturing strategy based on volatility indices.
    Ported concepts from Hummingbot: Inventory Skewing and Active Order Refresh.
    """
    def __init__(self, inventory_manager):
        self.logger = logging.getLogger("MarketMakingStrategy")
        self.inv = inventory_manager

    def maintain_quotes(self, canonical_id: str, current_fair: float, spread_bps: int):
        # 1. Base quotes
        half_spread = spread_bps / 10000.0
        bid = current_fair - half_spread
        ask = current_fair + half_spread
        
        # 2. Inventory Skewing Logic (Hummingbot Pattern)
        skew_adjust = self.inv.get_skew_for_event(canonical_id)
        
        bid += skew_adjust
        ask += skew_adjust
        
        self.logger.info(f"Target MM Quotes for {canonical_id}: [{bid:.3f} | {ask:.3f}] (Skew: {skew_adjust:.3f})")
        return {"bid": max(0.01, bid), "ask": min(0.99, ask)}
