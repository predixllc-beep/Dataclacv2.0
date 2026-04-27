import logging

class PortfolioAgent:
    \"\"\"
    Maintains overarching view of correlations. 
    Prevents holding max Trump + max GOP sweeps concurrently if limits breach.
    \"\"\"
    def __init__(self):
        self.logger = logging.getLogger("PortfolioAgent")
