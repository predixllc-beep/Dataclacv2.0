class ProbabilityMispricing:
    \"\"\"
    Compares local EV against OddsPipe consensus lines.
    \"\"\"
    def calculate_edge(self, price: float, fair: float) -> float:
        return fair - price
