import logging
import uuid
import time

class SupervisorAgent:
    """
    The Orchestrator. Evaluates multi-agent consensus before routing.
    Employs confidence-weighted voting.
    """
    def __init__(self):
        self.logger = logging.getLogger("SupervisorAgent")
        self.decision_log = []
        
    def _log_decision(self, event: str, decision: str, aggregated_score: float, reasoning: dict):
        record = {
            "id": str(uuid.uuid4()),
            "timestamp": time.time(),
            "event": event,
            "decision": decision,
            "score": aggregated_score,
            "reasoning": reasoning
        }
        self.decision_log.append(record)
        self.logger.info(f"Supervisor Decision Logged: {decision} | Score: {aggregated_score:.2f}")

    def arbitrate(self, canonical_id: str, agent_signals: list) -> dict:
        """
        Receives a list of signals from sub-agents.
        Each signal shape: {"agent": "Arb|Stat", "action": "BUY_Y|SELL_N|HOLD", "confidence": 0.0-1.0, "weight": 1.0}
        """
        self.logger.info("Arbitrating agent consensus...")
        
        if not agent_signals:
            return {"execute": False, "reason": "No signals provided"}
            
        action_scores = {}
        total_weight = 0.0
        
        for sig in agent_signals:
            action = sig.get("action")
            # Confidence (0 to 1) multiplied by agent authority weight (e.g. Arb=1.5, Stat=1.0)
            score = sig.get("confidence", 0.0) * sig.get("weight", 1.0)
            
            if action not in action_scores:
                action_scores[action] = 0.0
            action_scores[action] += score
            total_weight += sig.get("weight", 1.0)
            
        if total_weight == 0:
            return {"execute": False, "reason": "Zero weight logic error"}
            
        # Determine winning action
        winning_action = max(action_scores.items(), key=lambda x: x[1])
        action_str = winning_action[0]
        action_total_score = winning_action[1]
        
        # normalized confidence
        normalized_confidence = action_total_score / total_weight
        
        self._log_decision(
            event=canonical_id, 
            decision=action_str, 
            aggregated_score=normalized_confidence,
            reasoning=action_scores
        )
        
        # If HOLD won, or confidence < 0.70 threshold, do not execute
        if action_str == "HOLD" or normalized_confidence < 0.70:
            return {"execute": False, "reason": "Low conviction or Hold consensus"}
            
        return {
            "execute": True, 
            "action": action_str, 
            "confidence": normalized_confidence
        }
