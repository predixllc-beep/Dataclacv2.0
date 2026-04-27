import { useState, useEffect, useCallback } from 'react';

type WSMessage = {
  event: string;
  payload: any;
};

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Record<string, ((payload: any) => void)[]> = {};
  private url: string;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${protocol}//${window.location.host}/admin-ws`;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Control Plane Connected');
      this.emit('connection_status', { status: 'CONNECTED' });
    };

    this.ws.onclose = () => {
      console.log('Control Plane Disconnected');
      this.emit('connection_status', { status: 'DISCONNECTED' });
      // Reconnect logic
      setTimeout(() => this.connect(), 2000);
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        this.emit(data.event, data.payload);
      } catch (err) {
        console.error('WS Parse Error', err);
      }
    };
  }

  sendCommand(action: string, parameters: any = {}, user: string = 'ADMIN') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'admin_command',
        signature: 'mock_jwt_token',
        timestamp: Date.now(),
        payload: {
          action,
          parameters,
          user
        }
      }));
    } else {
      console.error('Cannot send command, WS not open.');
    }
  }

  on(event: string, callback: (payload: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (payload: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, payload: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

export const wsClient = new WebSocketClient();
