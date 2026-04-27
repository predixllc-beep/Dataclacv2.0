import time
import logging
import asyncio

from backend.connectors.unified_market_router import UnifiedMarketRouter
from backend.agents.supervisor_agent import SupervisorAgent
from backend.execution.oms.order_manager import OrderManager
from backend.execution.ems.execution_engine import ExecutionEngine
from backend.portfolio.ledger import Ledger
from backend.risk.risk_gateway import RiskGateway
from backend.orchestration.trade_lifecycle_orchestrator import TradeLifecycleOrchestrator
from backend.state.recovery_engine import RecoveryEngine
from backend.state.event_store import EventStore
from backend.monitoring.metrics import PrometheusMetrics

# UI Bridge
from backend.ui_bridge.state_streamer import StateStreamer
from backend.ui_bridge.command_router import CommandRouter
from backend.ui_bridge.websocket_gateway import WebSocketGateway

async def polling_loop(logger):
    """ The main algo loop """
    while True:
        # High-speed polling mock
        await asyncio.sleep(1.0)

async def main_async():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(name)s | %(levelname)s | %(message)s')
    logger = logging.getLogger("QuantNode")
    logger.info("Initializing Top-Tier Prediction Market Trading Infra...")
    
    config = {
        "POLY_KEY": "env_secret_poly",
        "POLY_SECRET": "env_secret_poly_l2",
        "KALSHI_KEY": "env_secret_kalshi",
        "PFUN_KEY": "env_secret_pfun"
    }
    
    # 1. Observability
    metrics = PrometheusMetrics(port=8000)
    
    # 2. State & Recovery
    event_store = EventStore()
    recovery = RecoveryEngine(event_store)
    
    # 3. Portfolio & Risk
    portfolio = Ledger()
    risk_gw = RiskGateway()
    
    # 4. OMS / EMS / Routing
    router = UnifiedMarketRouter(config)
    connectors = [router.poly_conn, router.kalshi_conn, router.pfun_conn]
    ems = ExecutionEngine(connectors)
    oms = OrderManager(ems)
    
    # Recover state
    recovery.recover_state(oms)
    
    # 5. Pipeline Orchestration
    orchestrator = TradeLifecycleOrchestrator(risk_gw, oms, portfolio)
    
    # 6. UI Bridge Control Plane
    streamer = StateStreamer()
    cmd_router = CommandRouter(orchestrator, risk_gw)
    ws_gateway = WebSocketGateway(cmd_router, streamer, host="0.0.0.0", port=8001)
    
    # 7. Agents
    supervisor = SupervisorAgent()
    
    logger.info("Control Plane and Main loop starting...")
    
    # Start tasks
    try:
        await asyncio.gather(
            ws_gateway.start_server(),
            polling_loop(logger)
        )
    except asyncio.CancelledError:
        logger.warning("Main execution loop cancelled.")

def main():
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        print("Keyboard Interrupt. Shutting down...")

if __name__ == "__main__":
    main()
