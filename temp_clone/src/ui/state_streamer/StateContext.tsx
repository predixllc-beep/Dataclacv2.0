import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsClient } from '../backend_bridge/websocket_client';

interface AppState {
  connectionStatus: 'DISCONNECTED' | 'CONNECTED';
  systemHealth: any;
  orders: any[];
  pnl: {
    unrealized_usd: number;
    realized_usd: number;
    net_delta_usd: number;
  };
  logs: any[];
}

const initialState: AppState = {
  connectionStatus: 'DISCONNECTED',
  systemHealth: { status: 'UNKNOWN', latency_poly_ms: 0, latency_kalshi_ms: 0, active_agents: 0 },
  orders: [],
  pnl: { unrealized_usd: 0, realized_usd: 0, net_delta_usd: 0 },
  logs: []
};

const StateContext = createContext<AppState>(initialState);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    wsClient.connect();

    const handleConnection = (payload: any) => setState(s => ({ ...s, connectionStatus: payload.status }));
    const handleHealth = (payload: any) => setState(s => ({ ...s, systemHealth: payload }));
    const handleOrder = (payload: any) => setState(s => {
      // Upsert order
      const existing = s.orders.findIndex(o => o.internal_id === payload.internal_id);
      const newOrders = [...s.orders];
      if (existing >= 0) newOrders[existing] = payload;
      else newOrders.push(payload);
      return { ...s, orders: newOrders };
    });
    const handlePnl = (payload: any) => setState(s => ({ ...s, pnl: payload }));

    // Setup logging stream
    const handleLog = (payload: any) => setState(s => ({ ...s, logs: [payload, ...s.logs].slice(0, 100) }));

    wsClient.on('connection_status', handleConnection);
    wsClient.on('system_health', handleHealth);
    wsClient.on('order_update', handleOrder);
    wsClient.on('pnl_update', handlePnl);
    wsClient.on('system_log', handleLog);

    return () => {
      wsClient.off('connection_status', handleConnection);
      wsClient.off('system_health', handleHealth);
      wsClient.off('order_update', handleOrder);
      wsClient.off('pnl_update', handlePnl);
      wsClient.off('system_log', handleLog);
    };
  }, []);

  return (
    <StateContext.Provider value={state}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
