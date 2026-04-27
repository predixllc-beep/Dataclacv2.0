import React, { useState } from 'react';
import { useAppState } from '../state_streamer/StateContext';
import { wsClient } from '../backend_bridge/websocket_client';
import { Cpu, Pause, Play } from 'lucide-react';

export const AgentsDashboard = () => {
  const [agents, setAgents] = useState([
    { id: 'Agent-Alpha', type: 'EventArb', status: 'RUNNING', confidence: 0.85 },
    { id: 'Agent-Gamma', type: 'MarketMaker', status: 'RUNNING', confidence: 0.92 },
    { id: 'Risk-Sentinel', type: 'Validator', status: 'RUNNING', confidence: 0.99 },
    { id: 'Kalshi-Scanner', type: 'DataIngest', status: 'PAUSED', confidence: 0.00 }
  ]);

  const toggleAgent = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING';
    wsClient.sendCommand('TOGGLE_AGENT', { agent_id: id, status: newStatus });
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 flex flex-col h-full min-h-0 material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest flex items-center shrink-0">
        <Cpu className="w-3 h-3 mr-1 text-[#2D62ED]" /> Swarm Control
      </h3>
      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {agents.map(a => (
          <div key={a.id} className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECEF] flex items-center justify-between material-shadow">
            <div>
               <div className="flex items-center space-x-2 mb-0.5">
                  <div className={`w-2 h-2 rounded-full ${a.status === 'RUNNING' ? 'bg-[#0ECB81] shadow-[0_0_8px_#0ECB81]' : 'bg-[#B7BDC6]'}`}></div>
                  <div className="font-mono text-sm font-bold text-[#1E2329]">{a.id}</div>
               </div>
               <div className="font-mono text-[10px] text-[#707A8A] uppercase">{a.type} • Conf: {(a.confidence * 100).toFixed(0)}%</div>
            </div>
            <button 
              onClick={() => toggleAgent(a.id, a.status)}
              className={`p-2 rounded-lg transition border material-shadow ${a.status === 'RUNNING' ? 'bg-white hover:bg-[#F6465D]/5 text-[#F6465D] border-[#EAECEF] hover:border-[#F6465D]' : 'bg-white hover:bg-[#0ECB81]/5 text-[#0ECB81] border-[#EAECEF] hover:border-[#0ECB81]'}`}
            >
              {a.status === 'RUNNING' ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
