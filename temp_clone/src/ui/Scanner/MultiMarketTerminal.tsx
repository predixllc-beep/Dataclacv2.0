import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, Filter, LayoutGrid } from 'lucide-react';
import { wsClient } from '../backend_bridge/websocket_client';
import { useAppState } from '../state_streamer/StateContext';

// --- Types ---
export interface NormalizedEvent {
  canonical_event_id: string;
  title: string;
  category: string;
  market_sources: string[];
  prices_by_market: Record<string, { yes: number; no: number }>;
  liquidity_by_market: Record<string, number>;
  ev_score: number;
  arbitrage_strength: number;
}

// --- Mock Data Generator (Replaces backend normalize_event for UI purposes) ---
const rawEvents = [
  { id: "E-FED-001", title: "Fed cuts rates in May 2026?", category: "Economics", markets: ["Polymarket", "Kalshi"], prices: { "Polymarket": {yes: 0.45, no: 0.55}, "Kalshi": {yes: 0.48, no: 0.52} }, liq: { "Polymarket": 1500000, "Kalshi": 800000 } },
  { id: "E-SPORT-042", title: "Arsenal vs Liverpool - Over 2.5 Goals", category: "Sports", markets: ["Predict.fun"], prices: { "Predict.fun": {yes: 0.60, no: 0.40} }, liq: { "Predict.fun": 45000 } },
  { id: "E-POL-003", title: "Democrat Win in PA 2028", category: "Politics", markets: ["Polymarket"], prices: { "Polymarket": {yes: 0.51, no: 0.49} }, liq: { "Polymarket": 5000000 } },
  { id: "E-TECH-012", title: "OpenAI GPT-5 Launch before Q3", category: "Science/Tech", markets: ["Kalshi"], prices: { "Kalshi": {yes: 0.35, no: 0.65} }, liq: { "Kalshi": 1200000 } },
  { id: "E-CRYPTO-009", title: "Bitcoin > $150k EOY", category: "Crypto", markets: ["Polymarket", "Predict.fun"], prices: { "Polymarket": {yes: 0.40, no: 0.60}, "Predict.fun": {yes: 0.35, no: 0.65} }, liq: { "Polymarket": 8500000, "Predict.fun": 100000 } }
];

function normalize_event(raw: any): NormalizedEvent {
  const ev_score = (Math.random() * 0.15) + 0.01; // Mock dynamic EV
  const hasArb = raw.markets.length > 1;
  let arbStrength = 0;
  if (hasArb) {
      const yesPrices = Object.values(raw.prices).map((p: any) => p.yes);
      arbStrength = Math.max(...yesPrices) - Math.min(...yesPrices);
  }
  
  return {
    canonical_event_id: raw.id,
    title: raw.title,
    category: raw.category,
    market_sources: raw.markets,
    prices_by_market: raw.prices,
    liquidity_by_market: raw.liq,
    ev_score: ev_score,
    arbitrage_strength: arbStrength > 0.02 ? arbStrength : 0
  };
}

const TABS = ["Polymarket", "Kalshi", "Predict.fun", "All Markets (Arb)"];

export const MultiMarketTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Polymarket");
  const [events, setEvents] = useState<NormalizedEvent[]>([]);

  // Simulation of periodic normalized data feed
  useEffect(() => {
    const fetchNormalized = () => {
      const normalized = rawEvents.map(normalize_event);
      // Data Normalization Requirement: Visual Priority Rule
      normalized.sort((a, b) => {
        if (b.ev_score !== a.ev_score) return b.ev_score - a.ev_score;
        const liqB = Object.values(b.liquidity_by_market).reduce((acc, v) => acc + v, 0);
        const liqA = Object.values(a.liquidity_by_market).reduce((acc, v) => acc + v, 0);
        if (liqB !== liqA) return liqB - liqA;
        return b.arbitrage_strength - a.arbitrage_strength;
      });
      setEvents(normalized);
    };
    
    fetchNormalized();
    const interval = setInterval(fetchNormalized, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === "All Markets (Arb)") {
      // Arbitrage section must ONLY show cross-market mismatches, same-event price diffs, EV > threshold
      return events.filter(e => e.market_sources.length > 1 && e.arbitrage_strength > 0);
    } else {
      return events.filter(e => e.market_sources.includes(activeTab));
    }
  }, [activeTab, events]);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] text-[#1E2329] font-sans">
      
      {/* TOP MARKET NAVIGATION */}
      <div className="flex items-center justify-between border-b border-[#EAECEF] bg-white px-4 py-2 shrink-0 z-10 material-shadow">
        <div className="flex space-x-1">
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tab 
                  ? 'bg-[#F5F5F5] text-[#2D62ED] border-t-2 border-[#2D62ED]' 
                  : 'text-[#707A8A] hover:text-[#1E2329] hover:bg-[#F5F5F5]'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-[#707A8A]">
             <Activity className="w-4 h-4 text-[#0ECB81]" />
             <span>NORMALIZED STREAM LIVE</span>
        </div>
      </div>

      {/* MARKET-SEGMENTED SCANNER */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#B7BDC6] font-mono text-sm">
            <Filter className="w-8 h-8 mb-3 opacity-50" />
            NO EVENTS FOUND FOR {activeTab.toUpperCase()}
          </div>
        ) : (
          <div className="grid gap-4">
             {filteredEvents.map(event => (
               <EventRow key={event.canonical_event_id} event={event} activeTab={activeTab} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventRow: React.FC<{event: NormalizedEvent, activeTab: string}> = ({ event, activeTab }) => {
  // Determine attributes based on active tab view constraint
  let displayMarkets = [activeTab];
  if (activeTab === "All Markets (Arb)") {
    displayMarkets = event.market_sources;
  }

  const isArbStrong = event.arbitrage_strength > 0.05;

  return (
    <div className="bg-white border border-[#EAECEF] hover:border-[#B7BDC6] transition-all p-5 flex flex-col space-y-4 rounded-xl material-shadow hover:material-hover-shadow">
      
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#1E2329] text-[16px] leading-tight mb-2">{event.title}</h3>
          <div className="flex items-center space-x-3 text-[11px] font-mono tracking-widest uppercase">
            <span className="text-[#707A8A] border border-[#EAECEF] bg-[#F8F9FA] px-2 py-0.5 rounded-sm">{event.category}</span>
            <span className="text-[#B7BDC6]">{event.canonical_event_id}</span>
            {event.arbitrage_strength > 0 && activeTab === "All Markets (Arb)" && (
              <span className={`flex items-center px-2 py-0.5 rounded-sm border ${isArbStrong ? 'bg-[#0ECB81]/10 text-[#0ECB81] border-[#0ECB81]/30' : 'bg-[#FCD535]/10 text-[#D29E10] border-[#FCD535]/30'}`}>
                <Zap className="w-3 h-3 mr-1" />
                ARB SPREAD: {(event.arbitrage_strength * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        
        {/* EV Score */}
        <div className="flex flex-col items-end shrink-0 pl-4">
          <span className="text-[10px] text-[#707A8A] font-mono uppercase mb-0.5">EV Score</span>
          <span className={`text-lg font-mono font-bold ${event.ev_score > 0.08 ? 'text-[#0ECB81]' : 'text-[#2D62ED]'}`}>
            +{(event.ev_score * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Market Segments (Isolated or Arb) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayMarkets.map(market => {
          const prices = event.prices_by_market[market];
          const liq = event.liquidity_by_market[market];
          if (!prices) return null;
          
          let badgeColor = 'bg-[#2D62ED]/10 text-[#2D62ED] border-[#2D62ED]/20';
          if (market === 'Polymarket') badgeColor = 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20';
          if (market === 'Kalshi') badgeColor = 'bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20';
          if (market === 'Predict.fun') badgeColor = 'bg-[#AF52DE]/10 text-[#AF52DE] border-[#AF52DE]/20';

          return (
            <div key={market} className="bg-[#F8F9FA] border border-[#EAECEF] rounded-lg p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${badgeColor}`}>
                  {market}
                </span>
                <span className="text-[10px] font-mono text-[#707A8A] flex items-center bg-white px-1.5 py-0.5 rounded border border-[#EAECEF]">
                  VOL: ${(liq || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 bg-white border border-[#0ECB81]/30 rounded p-2 text-center group cursor-pointer hover:border-[#0ECB81] hover:bg-[#0ECB81]/5 transition-colors">
                  <div className="text-[10px] text-[#0ECB81] font-mono mb-1 uppercase font-semibold">Yes</div>
                  <div className="text-sm font-bold font-mono text-[#0ECB81]">{(prices.yes * 100).toFixed(1)}¢</div>
                </div>
                <div className="flex-1 bg-white border border-[#F6465D]/30 rounded p-2 text-center group cursor-pointer hover:border-[#F6465D] hover:bg-[#F6465D]/5 transition-colors">
                  <div className="text-[10px] text-[#F6465D] font-mono mb-1 uppercase font-semibold">No</div>
                  <div className="text-sm font-bold font-mono text-[#F6465D]">{(prices.no * 100).toFixed(1)}¢</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
