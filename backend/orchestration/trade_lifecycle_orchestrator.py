import logging

class TradeLifecycleOrchestrator:
    """
    The god-class pipeline. Ensures data flows correctly through isolation blocks.
    Signal -> Risk -> OMS -> EMS -> Exchange -> Fill -> Risk -> Portfolio -> Recon.
    """
    def __init__(self, risk_gw, oms, portfolio):
        self.logger = logging.getLogger("Orchestrator")
        self.risk = risk_gw
        self.oms = oms
        self.portfolio = portfolio
        
    def process_signal(self, instruction):
        self.logger.info("Pipeline Start: New Signal")
        
        if not self.risk.pre_trade_risk(instruction, self.portfolio.exposure.net_delta):
            self.logger.warning("Pipeline Halted: Blocked by Risk Gateway")
            return
            
        order_id = self.oms.create_parent_order(instruction)
        if order_id:
            self.logger.info("Pipeline Progress: Sent to OMS/EMS")
            
    def on_fill(self, fill_report):
        self.risk.post_trade_risk(fill_report)
        self.portfolio.log_trade(fill_report.symbol, fill_report.size, fill_report.price, fill_report.side)
        self.logger.info("Pipeline Complete: Portfolio Adjusted.")
