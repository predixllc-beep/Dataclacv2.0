from enum import Enum, auto

class OrderType(Enum):
    MARKET = auto()
    LIMIT = auto()
    POST_ONLY = auto()
    IOC = auto()  # Immediate or Cancel
    FOK = auto()  # Fill or Kill

class OrderSide(Enum):
    BUY_YES = auto()
    SELL_YES = auto()
    BUY_NO = auto()
    SELL_NO = auto()

class TimeInForce(Enum):
    GTC = auto()
    GTD = auto() # Good till date
    IOC = auto()
    FOK = auto()

class ExecutionInstruction:
    def __init__(self, symbol: str, side: OrderSide, order_type: OrderType, price: float, size: float, reduce_only: bool = False):
        self.symbol = symbol
        self.side = side
        self.order_type = order_type
        self.price = price
        self.size = size
        self.reduce_only = reduce_only
