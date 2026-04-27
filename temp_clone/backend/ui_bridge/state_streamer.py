import logging
import json
import asyncio

class StateStreamer:
    """
    Subscribes to internal backend events (OMS/EMS/Risk) and pushes them onto
    a queue for the WebSocketGateway to dispatch to the React UI.
    """
    def __init__(self):
        self.logger = logging.getLogger("StateStreamer")
        self.message_queue = asyncio.Queue()
        
    async def push_telemetry(self, topic: str, payload: dict):
        msg = {
            "event": topic,
            "payload": payload
        }
        await self.message_queue.put(json.dumps(msg))
        
    async def get_next_message(self):
        return await self.message_queue.get()
