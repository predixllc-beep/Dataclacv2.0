import { useTradingStore } from '../store';

let interval: number | null = null;

export const connectWebSocketFeed = () => {
  const store = useTradingStore.getState();
  if (store.wsConnected) return;

  console.log("[DataClaw] Connecting to mock WebSocket feed...");
  store.setWsConnected(true);

  // Simulate incoming ticks
  interval = window.setInterval(() => {
    const currentState = useTradingStore.getState();
    if (!currentState.wsConnected) {
      if (interval) clearInterval(interval);
      return;
    }

    const symbols = Object.keys(currentState.markets);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const currentPrice = currentState.markets[randomSymbol].price;
    
    // Simulate tick movement (-1% to +1%)
    const movement = currentPrice * (Math.random() * 0.02 - 0.01);
    let newPrice = currentPrice + movement;
    
    // Keep probability between 0.01 and 0.99
    newPrice = Math.max(0.01, Math.min(0.99, newPrice));
    
    currentState.updateMarketPrice(randomSymbol, parseFloat(newPrice.toFixed(4)));
    currentState.updatePositions(randomSymbol, newPrice);
    
    // Periodically update total PNL
    useTradingStore.setState((state) => {
      const upnl = Object.values(state.positions).reduce((sum, p) => sum + p.unrealizedPnl, 0);
      return { 
        totalUnrealizedPnl: upnl,
        equity: 25000 + state.totalRealizedPnl + upnl
      };
    });

  }, 300); // 300ms ticks
};

export const disconnectWebSocketFeed = () => {
  if (interval) clearInterval(interval);
  useTradingStore.getState().setWsConnected(false);
  console.log("[DataClaw] WebSocket disconnected.");
};
