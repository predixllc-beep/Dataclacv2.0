import logging

class ExposureBook:
    def __init__(self):
        self.logger = logging.getLogger("ExposureBook")
        self.net_delta = 0.0
        
    def update_delta(self, asset: str, exposure_usd: float):
        self.net_delta += exposure_usd
        self.logger.info(f"Firm Net Delta now: {self.net_delta:.2f} USD")
