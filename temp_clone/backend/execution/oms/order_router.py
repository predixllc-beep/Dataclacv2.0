import logging

class OrderRouter:
    """Routes validated OMS orders to the appropriate EMS."""
    def __init__(self, ems_engine):
        self.logger = logging.getLogger("OMSRouter")
        self.ems = ems_engine
        
    def route(self, order_id: str, instruction):
        self.logger.info(f"Routing validated order {order_id} to EMS.")
        return self.ems.accept_order(order_id, instruction)
