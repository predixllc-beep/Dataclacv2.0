import React from 'react';
import { useAppState } from '../state_streamer/StateContext';
import { Activity } from 'lucide-react';

export const SystemHealth = () => {
  const { systemHealth } = useAppState();

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 shrink-0 material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest flex items-center">
        <Activity className="w-3 h-3 mr-1 text-[#2D62ED]" /> Health
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-[#F8F9FA] px-3 py-2 rounded-lg border border-[#EAECEF]">
          <span className="font-mono text-[11px] text-[#707A8A] uppercase">Poly RPC</span>
          <span className={`font-mono text-[11px] font-bold ${systemHealth.latency_poly_ms > 200 ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
            {systemHealth.latency_poly_ms || 0} ms
          </span>
        </div>
        <div className="flex justify-between items-center bg-[#F8F9FA] px-3 py-2 rounded-lg border border-[#EAECEF]">
          <span className="font-mono text-[11px] text-[#707A8A] uppercase">Kalshi REST</span>
          <span className={`font-mono text-[11px] font-bold ${systemHealth.latency_kalshi_ms > 200 ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
            {systemHealth.latency_kalshi_ms || 0} ms
          </span>
        </div>
        <div className="flex justify-between items-center bg-[#F8F9FA] px-3 py-2 rounded-lg border border-[#EAECEF]">
          <span className="font-mono text-[11px] text-[#707A8A] uppercase">Active Agents</span>
          <span className="font-mono text-[11px] font-bold text-[#2D62ED]">{systemHealth.active_agents || 0}</span>
        </div>
      </div>
    </div>
  );
};
