import logging
import uuid
import time
from backend.execution.oms.order_state_machine import OrderState, OrderStateMachine
from backend.execution.oms.order_validator import OrderValidator
from backend.execution.oms.order_router import OrderRouter
from backend.execution.oms.execution_instructions import ExecutionInstruction

class OrderManager:
    """
    Central OMS Ledger. Supports Parent/Child relationships.
    """
    def __init__(self, ems_engine):
        self.logger = logging.getLogger("OrderManager")
        self.orders = {}
        self.validator = OrderValidator()
        self.router = OrderRouter(ems_engine)
        
    def create_parent_order(self, instruction: ExecutionInstruction) -> str:
        if not self.validator.validate(instruction):
            return None
            
        internal_id = str(uuid.uuid4())
        self.orders[internal_id] = {
            "id": internal_id,
            "instruction": instruction,
            "state": OrderState.NEW,
            "filled_size": 0.0,
            "child_orders": [],
            "timestamp": time.time()
        }
        
        self.logger.info(f"Generated Parent Order: {internal_id} | {instruction.side.name} {instruction.size} @ {instruction.price}")
        self.advance_state(internal_id, OrderState.PENDING_SUBMIT)
        self.router.route(internal_id, instruction)
        return internal_id
        
    def advance_state(self, order_id: str, new_state: OrderState, filled_amount: float = 0.0):
        order = self.orders.get(order_id)
        if not order:
            return
            
        try:
            OrderStateMachine.validate_transition(order["state"], new_state)
            order["state"] = new_state
            if filled_amount > 0:
                order["filled_size"] += filled_amount
            self.logger.info(f"OMS Order {order_id} -> {new_state.name} | Filled: {order['filled_size']}")
        except Exception as e:
            self.logger.error(str(e))
