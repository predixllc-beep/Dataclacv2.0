from enum import Enum

class OrderState(Enum):
    NEW = "NEW"
    PENDING_SUBMIT = "PENDING_SUBMIT"
    SUBMITTED = "SUBMITTED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    PARTIAL_FILL = "PARTIAL_FILL"
    FILLED = "FILLED"
    PENDING_CANCEL = "PENDING_CANCEL"
    CANCELED = "CANCELED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class StateMachineError(Exception):
    pass

class OrderStateMachine:
    VALID_TRANSITIONS = {
        OrderState.NEW: [OrderState.PENDING_SUBMIT, OrderState.REJECTED],
        OrderState.PENDING_SUBMIT: [OrderState.SUBMITTED, OrderState.REJECTED],
        OrderState.SUBMITTED: [OrderState.ACKNOWLEDGED, OrderState.REJECTED, OrderState.CANCELED],
        OrderState.ACKNOWLEDGED: [OrderState.PARTIAL_FILL, OrderState.FILLED, OrderState.PENDING_CANCEL, OrderState.CANCELED, OrderState.EXPIRED],
        OrderState.PARTIAL_FILL: [OrderState.FILLED, OrderState.PENDING_CANCEL, OrderState.CANCELED, OrderState.EXPIRED, OrderState.PARTIAL_FILL],
        OrderState.PENDING_CANCEL: [OrderState.CANCELED, OrderState.FILLED],
        OrderState.FILLED: [],
        OrderState.CANCELED: [],
        OrderState.REJECTED: [],
        OrderState.EXPIRED: []
    }

    @staticmethod
    def validate_transition(current: OrderState, target: OrderState) -> bool:
        if target in OrderStateMachine.VALID_TRANSITIONS.get(current, []):
            return True
        raise StateMachineError(f"Invalid transition from {current.name} to {target.name}")
