from prometheus_client import Counter, Gauge, Histogram, start_http_server

class PrometheusMetrics:
    """
    Exposes a metrics endpoint for Prometheus scrapers on port 8000.
    """
    def __init__(self, port=8000):
        self.port = port
        
        # Define Metrics
        self.trades_executed = Counter('trades_executed_total', 'Count of trades executed', ['venue', 'side'])
        self.pnl_gauge = Gauge('realized_pnl_usd', 'Total Realized PnL in USD')
        self.exposure_gauge = Gauge('current_exposure_usd', 'Current gross exposure risk')
        self.latency_histogram = Histogram('order_latency_ms', 'Latency from local to exchange ACK', ['venue'])
        
    def start_server(self):
        start_http_server(self.port)
        
    def record_trade(self, venue: str, side: str, amount_usd: float):
        self.trades_executed.labels(venue=venue, side=side).inc()
        
    def set_pnl(self, current_pnl: float):
        self.pnl_gauge.set(current_pnl)
        
    def set_exposure(self, exposure: float):
        self.exposure_gauge.set(exposure)
        
    def observe_latency(self, venue: str, latency_ms: float):
        self.latency_histogram.labels(venue=venue).observe(latency_ms)
