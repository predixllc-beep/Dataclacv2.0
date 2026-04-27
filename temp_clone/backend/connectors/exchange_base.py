import logging

class ExchangeBase:
    """
    CCXT-inspired generalized abstraction.
    All integrations MUST inherit from this and implement the interfaces.
    """
    def __init__(self, key: str, secret: str = None, passphrase: str = None):
        self.key = key
        self.secret = secret
        self.passphrase = passphrase
        self.logger = logging.getLogger(self.__class__.__name__)
        
    def fetch_orderbook(self, symbol: str) -> dict:
        """ Returns unified orderbook format: {'bids': [[price, qty]], 'asks': [[price, qty]]} """
        raise NotImplementedError
        
    def create_order(self, symbol: str, side: str, order_type: str, price: float, amount: float, params: dict = {}) -> dict:
        """ Returns unified order object: {'id': 'ex_id', 'status': 'open', 'symbol': symbol...} """
        raise NotImplementedError
        
    def cancel_order(self, id: str, symbol: str = None) -> dict:
        """ Attempts cancellation. """
        raise NotImplementedError
        
    def fetch_my_trades(self, symbol: str = None, since: int = None, limit: int = None) -> list:
        """ Realized fills for reconciliation. """
        raise NotImplementedError
        
    def fetch_balance(self) -> dict:
        """ Normalizes portfolio query. """
        raise NotImplementedError
