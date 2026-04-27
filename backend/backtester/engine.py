import logging
import random
import time

class BacktestEngine:
    """
    Mock matching engine that simulates liquidity depth and latency for paper trading
    and high-speed backtesting.
    """
    def __init__(self):
        self.logger = logging.getLogger("BacktestEngine")
        
    def simulate_fill(self, price: float, size: float, book_depth: float, network_latency_ms: int = 50) -> dict:
        """
        Calculates slippage and fill probabilty based on mocked top-of-book depth.
        """
        # simulate network trip
        time.sleep(network_latency_ms / 1000.0)
        
        # If we exceed the book depth, we slip.
        if size > book_depth:
            penalty = (size - book_depth) * 0.005 # 50bps slippage per dollar over depth
            avg_fill_price = price + penalty if price < 0.50 else price - penalty
            self.logger.warning(f"Simulated size > depth. Slipped to {avg_fill_price:.4f}")
            return {
                "status": "FILLED",
                "fill_price": avg_fill_price,
                "fill_qty": size
            }
            
        # 5% chance of random rejection simulating blockchain/exchange jitter
        if random.random() < 0.05:
            self.logger.info("Simulated exchange rejection.")
            return {"status": "REJECTED"}
            
        return {
             "status": "FILLED",
             "fill_price": price,
             "fill_qty": size
        }

    def run_simulation(self, historical_data_ticks: list, strategy_agent):
        self.logger.info(f"Starting simulation on {len(historical_data_ticks)} ticks...")
        # loop through ticks and feed to agent
        for tick in historical_data_ticks:
             pass

