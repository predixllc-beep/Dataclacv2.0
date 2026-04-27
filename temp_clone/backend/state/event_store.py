import logging
import json
import os

class EventStore:
    """
    Append-only persistent log of all state transitions locally for crash recovery.
    """
    def __init__(self, filename="recovery_journal.jsonl"):
        self.logger = logging.getLogger("EventStore")
        self.filename = filename
        
    def append_event(self, event_type: str, payload: dict):
        record = {"type": event_type, "data": payload}
        with open(self.filename, 'a') as f:
            f.write(json.dumps(record) + "\n")
