class ExposureEngine:
    \"\"\"
    Maintains a real-time ledger of outstanding execution risk.
    \"\"\"
    def __init__(self):
        self._current_exposure = 0.0
        
    def add_exposure(self, amount: float):
        self._current_exposure += amount
        
    def check_headroom(self, request_amount: float, cap: float) -> bool:
        return (self._current_exposure + request_amount) <= cap
