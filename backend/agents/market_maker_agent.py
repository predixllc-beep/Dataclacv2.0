import logging

class MarketMakerAgent:
    \"\"\"
    Provides liquidity on wide spread prediction markets.
    Adjusts skew based on adverse selection metrics.
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("MarketMakerAgent")
        
    def calculate_quotes(self, current_fair: float, spread_bps: int):
        bid = current_fair - (spread_bps / 10000)
        ask = current_fair + (spread_bps / 10000)
        return {"bid": max(0.01, bid), "ask": min(0.99, ask)}
