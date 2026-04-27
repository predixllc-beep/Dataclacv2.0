import logging
from backend.execution.oms.execution_instructions import ExecutionInstruction
from backend.execution.ems.smart_router import SmartRouter
from backend.execution.ems.execution_algorithms import ExecutionAlgorithms

class ExecutionEngine:
    """
    Receives OMS orders, applies algorithms, and drives them to exchanges via SmartRouter.
    """
    def __init__(self, connectors):
        self.logger = logging.getLogger("EMS")
        self.router = SmartRouter(connectors)
        self.algo = ExecutionAlgorithms()
        
    def accept_order(self, internal_id: str, instruction: ExecutionInstruction):
        self.logger.info(f"EMS accepted {internal_id}. Applying routing logic.")
        
        # Determine execution path
        if instruction.size > 1000:
            chunks = self.algo.execute_iceberg(instruction.size, 500)
            self.logger.info(f"Institutional size -> Chunked to {len(chunks)} child orders.")
        else:
            chunks = [instruction.size]
            
        # Route child chunks
        for chunk_size in chunks:
            venue = self.router.selector.select_best_venue(instruction.symbol, instruction.side.name, instruction.price)
            self.router.route_child(instruction, venue)
            
        return True
