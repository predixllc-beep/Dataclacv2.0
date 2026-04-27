import logging

class SettlementReconciliation:
    """
    Ensures that when an event resolves (e.g. Trump wins), the expected payout 
    actually lands in our portfolio balances. 
    Crucial missing risk-layer for real-money PM operations.
    """
    def __init__(self):
        self.logger = logging.getLogger("SettlementRecon")
        self.pending_settlements = {}
        
    def flag_for_settlement(self, canonical_id: str, expected_payout_usd: float):
        self.pending_settlements[canonical_id] = expected_payout_usd
        self.logger.info(f"Flagged {canonical_id} for expected settlement: ${expected_payout_usd:.2f}")
        
    def verify_arrival(self, canonical_id: str, actual_credit: float):
        expected = self.pending_settlements.get(canonical_id, 0.0)
        diff = actual_credit - expected
        if abs(diff) > 1.0: # allow 1 dollar discrepancy for tiny rounding/gas fees
            self.logger.error(f"SETTLEMENT MISMATCH for {canonical_id}: Expected {expected:.2f}, Got {actual_credit:.2f}")
            return False
        
        self.logger.info(f"Settlement verified for {canonical_id}.")
        del self.pending_settlements[canonical_id]
        return True
