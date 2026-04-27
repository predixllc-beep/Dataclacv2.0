import logging
from backend.execution.oms.execution_instructions import ExecutionInstruction, OrderType

class OrderValidator:
    """Pre-trade OMS validator. Enforces technical constraints."""
    def __init__(self):
        self.logger = logging.getLogger("OMSValidator")
        
    def validate(self, instruction: ExecutionInstruction) -> bool:
        if instruction.price <= 0 or instruction.price >= 1.0:
            self.logger.error(f"Invalid price boundary: {instruction.price}")
            return False
            
        if instruction.size <= 0:
            self.logger.error("Size must be strictly positive.")
            return False
            
        if instruction.order_type == OrderType.MARKET:
            self.logger.error("MARKET orders are strictly disallowed due to AMM slippage risk. Use Limit mapping.")
            return False
            
        return True
