import React, { useState } from 'react';
import { useAppState } from '../state_streamer/StateContext';
import { wsClient } from '../backend_bridge/websocket_client';

export const TradingTerminal = () => {
  const [symbol, setSymbol] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('BUY_YES');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(confirm(`Inject Manual Order: ${side} ${size} ${symbol} @ ${price}?`)) {
      wsClient.sendCommand('MANUAL_ORDER', {
        symbol: symbol.toUpperCase(),
        size: parseFloat(size),
        price: parseFloat(price),
        side,
        order_type: 'LIMIT'
      });
      setSymbol('');
    }
  };

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 shrink-0 material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest">Manual Terminal</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <select value={side} onChange={(e) => setSide(e.target.value)} className="w-full bg-[#F5F5F5] border border-[#EAECEF] text-xs font-mono text-[#1E2329] p-2.5 rounded-lg focus:ring-1 focus:ring-[#2D62ED] outline-none transition-shadow">
          <option value="BUY_YES">BUY YES</option>
          <option value="SELL_YES">SELL YES</option>
          <option value="BUY_NO">BUY NO</option>
          <option value="SELL_NO">SELL NO</option>
        </select>
        <div className="flex space-x-2">
          <input required type="text" placeholder="TICKER" value={symbol} onChange={e => setSymbol(e.target.value)} className="flex-1 min-w-0 bg-[#F5F5F5] border border-[#EAECEF] text-xs font-mono text-[#1E2329] p-2.5 rounded-lg focus:ring-1 focus:ring-[#2D62ED] outline-none uppercase transition-shadow" />
        </div>
        <div className="flex space-x-2">
          <input required type="number" step="0.01" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="flex-1 bg-[#F5F5F5] border border-[#EAECEF] text-xs font-mono text-[#1E2329] p-2.5 rounded-lg focus:ring-1 focus:ring-[#2D62ED] outline-none transition-shadow" />
          <input required type="number" placeholder="Size" value={size} onChange={e => setSize(e.target.value)} className="flex-1 bg-[#F5F5F5] border border-[#EAECEF] text-xs font-mono text-[#1E2329] p-2.5 rounded-lg focus:ring-1 focus:ring-[#2D62ED] outline-none transition-shadow" />
        </div>
        <button type="submit" className="w-full bg-[#FCD535] text-[#1E2329] hover:bg-[#F0C929] text-xs font-mono py-3 rounded-lg transition-colors font-bold uppercase tracking-wider mt-2 material-shadow hover:material-hover-shadow">EXECUTE ORDER</button>
      </form>
    </div>
  );
};
