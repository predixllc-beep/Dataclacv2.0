import unittest
from backend.risk.anomaly_guard import AnomalyGuard

class TestAnomalyGuard(unittest.TestCase):
    
    def test_flash_crash_rejection(self):
        guard = AnomalyGuard()
        # normal slide
        self.assertTrue(guard.check_price_delta(0.50, 0.45))
        # instant crash
        self.assertFalse(guard.check_price_delta(0.95, 0.10))
        # instant rip
        self.assertFalse(guard.check_price_delta(0.10, 0.90))

if __name__ == '__main__':
    unittest.main()
