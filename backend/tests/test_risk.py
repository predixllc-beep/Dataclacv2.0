import unittest
from backend.risk.position_limits import PositionLimits
from backend.risk.exposure_engine import ExposureEngine

class TestRisk(unittest.TestCase):
    
    def test_position_limits(self):
        # Assuming Max is 5000
        self.assertTrue(PositionLimits.validate_size(1000))
        self.assertTrue(PositionLimits.validate_size(5000))
        self.assertFalse(PositionLimits.validate_size(5001))
        
    def test_exposure_engine(self):
        engine = ExposureEngine()
        engine.add_exposure(1000)
        self.assertTrue(engine.check_headroom(2000, cap=5000))
        self.assertFalse(engine.check_headroom(4001, cap=5000))

if __name__ == '__main__':
    unittest.main()
