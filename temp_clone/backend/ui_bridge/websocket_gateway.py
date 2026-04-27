import logging
import asyncio
import websockets
import json
from backend.ui_bridge.state_streamer import StateStreamer
from backend.ui_bridge.command_router import CommandRouter

class WebSocketGateway:
    """
    Hosts the WebSocket server for the Admin Control Plane UI.
    """
    def __init__(self, command_router: CommandRouter, streamer: StateStreamer, host="0.0.0.0", port=8001):
        self.logger = logging.getLogger("WebSocketGateway")
        self.host = host
        self.port = port
        self.router = command_router
        self.streamer = streamer
        self.connected_clients = set()
        
    async def handler(self, websocket, path):
        self.connected_clients.add(websocket)
        self.logger.info(f"UI Client connected. Total clients: {len(self.connected_clients)}")
        try:
            # Task to listen for incoming commands
            async for message in websocket:
                try:
                    payload = json.loads(message)
                    event_type = payload.get("event")
                    if event_type == "admin_command":
                        response = self.router.handle_command(payload.get("payload", {}))
                        await websocket.send(json.dumps({"event": "command_response", "payload": response}))
                except Exception as e:
                    self.logger.error(f"Error parsing incoming WS message: {e}")
        finally:
            self.connected_clients.remove(websocket)
            self.logger.info(f"UI Client disconnected.")
            
    async def broadcast_loop(self):
        """ Pulls from StateStreamer and broadcasts to all UI clients. """
        while True:
            msg = await self.streamer.get_next_message()
            if self.connected_clients:
                # Fire and forget broadcasting
                tasks = [asyncio.create_task(client.send(msg)) for client in self.connected_clients]
                await asyncio.gather(*tasks, return_exceptions=True)
                
    async def start_server(self):
        server = await websockets.serve(self.handler, self.host, self.port)
        self.logger.info(f"WebSocket Gateway started on ws://{self.host}:{self.port}")
        
        # Start broadcast task
        asyncio.create_task(self.broadcast_loop())
        await server.wait_closed()
