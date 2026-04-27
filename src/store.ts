import { create } from 'zustand';

// --- Types ---
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  size: number;
  status: OrderStatus;
  timestamp: number;
  filledSize: number;
  avgFillPrice: number;
}

export interface Position {
  symbol: string;
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  change24h: number;
  history: { time: string; price: number }[];
}

export interface TradingState {
  isLiveMode: boolean;
  toggleMode: () => void;
  
  // Connections
  wsConnected: boolean;
  setWsConnected: (status: boolean) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp' | 'filledSize' | 'avgFillPrice'>) => void;
  cancelOrder: (id: string) => void;
  
  // Positions
  positions: Record<string, Position>;
  updatePositions: (symbol: string, currentPrice: number) => void;
  
  // Risk
  killSwitchArmed: boolean;
  killSwitchEngaged: boolean;
  armKillSwitch: (armed: boolean) => void;
  engageKillSwitch: () => void;
  maxDrawdown: number;
  marginUtilization: number;
  var95: number;
  var99: number;
  
  // Market Data (Live feed simulation)
  markets: Record<string, MarketData>;
  updateMarketPrice: (symbol: string, newPrice: number) => void;
  
  // PNL
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  equity: number;
}

const INITIAL_EQUITY = 25000;

const initialMarkets: Record<string, MarketData> = {
  'FED_RATE_MAY26': { symbol: 'FED_RATE_MAY26', price: 0.65, bid: 0.64, ask: 0.66, volume: 1500000, change24h: 0.05, history: Array(30).fill(0).map((_, i) => ({ time: `${i}`, price: 0.60 + Math.random() * 0.1 })) },
  'ELECTION_PA_28': { symbol: 'ELECTION_PA_28', price: 0.42, bid: 0.41, ask: 0.43, volume: 3200000, change24h: -0.02, history: Array(30).fill(0).map((_, i) => ({ time: `${i}`, price: 0.40 + Math.random() * 0.1 })) },
  'BTC_100K_2026': { symbol: 'BTC_100K_2026', price: 0.88, bid: 0.87, ask: 0.89, volume: 8000000, change24h: 0.12, history: Array(30).fill(0).map((_, i) => ({ time: `${i}`, price: 0.80 + Math.random() * 0.1 })) }
};

export const useTradingStore = create<TradingState>((set, get) => ({
  isLiveMode: false,
  toggleMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
  
  wsConnected: false,
  setWsConnected: (status) => set({ wsConnected: status }),

  orders: [],
  placeOrder: (orderRequest) => set((state) => {
    if (state.killSwitchEngaged) {
      console.warn("ORDER REJECTED: Kill switch is engaged.");
      return state;
    }
    
    const newOrder: Order = {
      ...orderRequest,
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      status: 'PENDING',
      timestamp: Date.now(),
      filledSize: 0,
      avgFillPrice: 0,
    };
    
    // Simulate immediate fill for MARKET orders (Mock backend behavior)
    if (newOrder.type === 'MARKET') {
       newOrder.status = 'FILLED';
       newOrder.filledSize = newOrder.size;
       newOrder.avgFillPrice = state.markets[newOrder.symbol]?.price || newOrder.price;
       
       // Update position
       const positions = { ...state.positions };
       const currentPos = positions[newOrder.symbol] || { symbol: newOrder.symbol, size: 0, entryPrice: 0, unrealizedPnl: 0, realizedPnl: 0 };
       
       const sizeDirection = newOrder.side === 'BUY' ? 1 : -1;
       const newSize = currentPos.size + (newOrder.size * sizeDirection);
       
       if (newSize !== 0) {
          // Simplistic average entry price calculation
          currentPos.entryPrice = (currentPos.entryPrice * Math.abs(currentPos.size) + newOrder.avgFillPrice * newOrder.size) / Math.abs(newSize);
       } else {
          currentPos.entryPrice = 0;
       }
       
       currentPos.size = newSize;
       positions[newOrder.symbol] = currentPos;
       
       return { orders: [newOrder, ...state.orders], positions };
    }

    return { orders: [newOrder, ...state.orders] };
  }),
  
  cancelOrder: (id) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o)
  })),

  positions: {},
  updatePositions: (symbol, currentPrice) => set((state) => {
    const pos = state.positions[symbol];
    if (!pos || pos.size === 0) return state;
    
    const direction = pos.size > 0 ? 1 : -1;
    const unrealized = (currentPrice - pos.entryPrice) * Math.abs(pos.size) * direction;
    
    return {
      positions: {
        ...state.positions,
        [symbol]: { ...pos, unrealizedPnl: unrealized }
      }
    };
  }),

  killSwitchArmed: false,
  killSwitchEngaged: false,
  armKillSwitch: (armed) => set({ killSwitchArmed: armed }),
  engageKillSwitch: () => set((state) => {
    // Cancel all pending orders, close all positions (in a real system)
    return { 
      killSwitchEngaged: true, 
      orders: state.orders.map(o => o.status === 'PENDING' ? { ...o, status: 'CANCELLED' } : o) 
    };
  }),
  maxDrawdown: -4.2,
  marginUtilization: 12.5,
  var95: 1450,
  var99: 2100,

  markets: initialMarkets,
  updateMarketPrice: (symbol, newPrice) => set((state) => {
    const market = state.markets[symbol];
    if (!market) return state;
    
    const newHistory = [...market.history, { time: new Date().toISOString(), price: newPrice }].slice(-30);
    const updatedMarket = { 
      ...market, 
      price: newPrice, 
      bid: newPrice - 0.01, 
      ask: newPrice + 0.01,
      history: newHistory
    };
    
    // Also trigger position update
    const stateWithNewMarket = {
      markets: { ...state.markets, [symbol]: updatedMarket }
    };
    
    return stateWithNewMarket;
  }),
  
  totalRealizedPnl: 1240.50,
  totalUnrealizedPnl: 0,
  equity: INITIAL_EQUITY,
}));
