class PositionLimits:
    \"\"\"
    Defines hardcaps on market exposures.
    \"\"\"
    PORTFOLIO_MAX_DRAWDOWN = 0.15 # 15%
    MAX_POSITION_SIZE_USD = 5000  # $5k per event
    MAX_OPEN_ORDERS = 50
    
    @classmethod
    def validate_size(cls, size: float) -> bool:
        return size <= cls.MAX_POSITION_SIZE_USD
