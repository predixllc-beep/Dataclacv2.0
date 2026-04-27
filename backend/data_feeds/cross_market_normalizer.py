import logging
import hashlib

class CrossMarketNormalizer:
    """
    Normalizes divergent exchange markets into a single canonical tradeable entity.
    e.g., Kalshi "INFLATION-24-03" -> Poly "0x2A...4B" -> Canonical "US_CPI_OVER_3_MAR_2024"
    """
    def __init__(self):
        self.logger = logging.getLogger("CrossMarketNormalizer")
        self._canonical_book = {}
        
    def generate_canonical_hash(self, base_event: str, outcome_condition: str) -> str:
        """
        Derives a deterministic UUID-style hash for identical events.
        """
        raw = f"{base_event}_{outcome_condition}".upper()
        return hashlib.sha256(raw.encode('utf-8')).hexdigest()[:16]

    def register_market(self, canonical_id: str, exchange: str, exchange_ticker: str, metadata: dict = None):
        if canonical_id not in self._canonical_book:
            self._canonical_book[canonical_id] = {
                "poly": None,
                "kalshi": None,
                "predictfun": None,
                "metadata": metadata or {}
            }
            
        self._canonical_book[canonical_id][exchange] = exchange_ticker
        self.logger.info(f"Registered {exchange_ticker} on {exchange} => {canonical_id}")
        
    def get_exchange_ticker(self, canonical_id: str, exchange: str) -> str:
        mapping = self._canonical_book.get(canonical_id)
        if not mapping:
            return None
        return mapping.get(exchange)
        
    def get_all_linked_markets(self, canonical_id: str) -> dict:
        return self._canonical_book.get(canonical_id, {})
