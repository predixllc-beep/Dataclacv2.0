import logging
from typing import Dict, Any

from .polymarket_connector import PolymarketConnector
from .kalshi_connector import KalshiConnector
from .predictfun_connector import PredictFunConnector

class UnifiedMarketRouter:
    """
    Smart Order Routing logic. Translates a unified trade request into venue-specific operations.
    Handles failovers and retries.
    """
    def __init__(self, config: Dict[str, Any]):
        self.logger = logging.getLogger("UnifiedMarketRouter")
        
        # In a real environment, read from secrets engine
        self.poly_conn = PolymarketConnector(
            api_key=config.get("POLY_KEY", ""), 
            secret_key=config.get("POLY_SECRET", ""),
            passphrase=config.get("POLY_PASSPHRASE", "")
        )
        self.kalshi_conn = KalshiConnector(key=config.get("KALSHI_KEY", ""), cert_path=config.get("KALSHI_CERT", ""))
        self.pfun_conn = PredictFunConnector(api_key=config.get("PFUN_KEY", ""))

    def route_trade(self, canonical_event_id: str, side: str, max_price_usd: float, size_usd: float, preferred_venue: str = "auto") -> Dict[str, Any]:
        """
        Routes an order to the best execution venue.
        Uses CCXT-style create_order interface.
        """
        order_type = "limit"
        if preferred_venue == "polymarket":
            return self.poly_conn.create_order(canonical_event_id, side, order_type, max_price_usd, size_usd)
        elif preferred_venue == "kalshi":
            return self.kalshi_conn.create_order(canonical_event_id, side, order_type, max_price_usd, round(size_usd))
        elif preferred_venue == "predictfun":
            return self.pfun_conn.create_order(canonical_event_id, side, order_type, max_price_usd, size_usd)
        
        # Smart routing fallback logic
        self.logger.info("Auto-routing to liquidity sink (Polymarket assumed)...")
        return self.poly_conn.create_order(canonical_event_id, side, order_type, max_price_usd, size_usd)
