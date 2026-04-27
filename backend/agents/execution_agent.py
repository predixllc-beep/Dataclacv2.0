import logging

class ExecutionAgent:
    \"\"\"
    TWAP / VWAP execution slicing algorithm to prevent moving the AMM bonding curve massively.
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("ExecutionAgent")
        
    def slice_order(self, total_size: float, chunks: int):
        return [total_size / chunks for _ in range(chunks)]
