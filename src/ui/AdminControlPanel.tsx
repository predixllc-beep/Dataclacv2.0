import React, { useState } from 'react';
import { StateProvider, useAppState } from './state_streamer/StateContext';
import { wsClient } from './backend_bridge/websocket_client';
import { ShieldAlert, Crosshair, Cpu, ListTree, Activity, ActivitySquare } from 'lucide-react';
import { MultiMarketTerminal } from './Scanner/MultiMarketTerminal';
import { TradingTerminal } from './modules/TradingTerminal';
import { ExecutionDashboard } from './modules/ExecutionDashboard';
import { PortfolioDashboard } from './modules/PortfolioDashboard';
import { AgentsDashboard } from './modules/AgentsDashboard';
import { SystemHealth } from './modules/SystemHealth';
import { RiskDashboard } from './modules/RiskDashboard';
import { AuditLogs } from './modules/AuditLogs';

const TopNav = () => {
  const { connectionStatus, pnl } = useAppState();

  const handleEmergencyFlatten = () => {
    if (confirm("WARNING: Are you sure you want to completely flatten the portfolio? This will exit all risk at market prices.")) {
      wsClient.sendCommand('EMERGENCY_FLATTEN');
    }
  };

  const handleKillSwitch = () => {
    if (confirm("HALT TRADING? Yes to halt.")) {
      wsClient.sendCommand('KILL_SWITCH');
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#EAECEF] text-[#1E2329] shrink-0 z-10 material-shadow relative">
      <div className="flex items-center space-x-4">
        <ShieldAlert className="w-6 h-6 text-[#FCD535]" />
        <h1 className="text-lg font-bold font-mono tracking-tight text-[#1E2329] uppercase">Polyclaw OS</h1>
        <div className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-widest ${connectionStatus === 'CONNECTED' ? 'bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/30' : 'bg-[#F6465D]/10 text-[#F6465D] border border-[#F6465D]/30'}`}>
          {connectionStatus}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#707A8A] font-mono uppercase">Realized PnL</span>
          <span className="font-mono text-sm font-bold text-[#0ECB81]">${pnl.realized_usd.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#707A8A] font-mono uppercase">Unrealized M2M</span>
          <span className={`font-mono text-sm font-bold ${pnl.unrealized_usd >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            ${pnl.unrealized_usd.toFixed(2)}
          </span>
        </div>
        <div className="h-8 w-px bg-[#EAECEF]"></div>
        <button onClick={handleKillSwitch} className="bg-[#FCD535] text-[#1E2329] hover:bg-[#F0C929] px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider font-bold rounded transition material-shadow">
          Kill Switch
        </button>
        <button onClick={handleEmergencyFlatten} className="bg-[#F6465D]/10 text-[#F6465D] border border-[#F6465D]/30 hover:bg-[#F6465D] hover:text-white px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider font-bold rounded transition">
          Emergency Flatten
        </button>
      </div>
    </div>
  );
};

export const AdminControlPanel = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<'SCANNER' | 'EXECUTION' | 'AGENTS' | 'PORTFOLIO'>('SCANNER');

  return (
    <StateProvider>
      <div className="h-[100dvh] w-full bg-[#F5F5F5] text-[#1E2329] flex flex-col font-sans overflow-hidden">
        <TopNav />
        
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar Navigation */}
          <div className="w-16 bg-white border-r border-[#EAECEF] flex flex-col items-center py-4 space-y-4 shrink-0 z-10">
            <NavIcon 
              active={activeWorkspace === 'SCANNER'} 
              onClick={() => setActiveWorkspace('SCANNER')} 
              icon={<Crosshair className="w-5 h-5" />} 
              label="Scanner" 
            />
            <NavIcon 
              active={activeWorkspace === 'EXECUTION'} 
              onClick={() => setActiveWorkspace('EXECUTION')} 
              icon={<ListTree className="w-5 h-5" />} 
              label="Execution" 
            />
            <NavIcon 
              active={activeWorkspace === 'AGENTS'} 
              onClick={() => setActiveWorkspace('AGENTS')} 
              icon={<Cpu className="w-5 h-5" />} 
              label="Agents" 
            />
            <NavIcon 
              active={activeWorkspace === 'PORTFOLIO'} 
              onClick={() => setActiveWorkspace('PORTFOLIO')} 
              icon={<ActivitySquare className="w-5 h-5" />} 
              label="Risk" 
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F5F5F5]">
            
            {activeWorkspace === 'SCANNER' && (
              <div className="absolute inset-0 flex flex-col">
                 <MultiMarketTerminal />
              </div>
            )}

            {activeWorkspace === 'EXECUTION' && (
              <div className="absolute inset-0 flex p-6 gap-6 overflow-y-auto">
                 <div className="flex flex-col w-1/3 gap-6">
                    <TradingTerminal />
                    <SystemHealth />
                 </div>
                 <div className="flex-1">
                    <ExecutionDashboard />
                 </div>
              </div>
            )}

            {activeWorkspace === 'AGENTS' && (
              <div className="absolute inset-0 flex p-6 gap-6 overflow-y-auto">
                 <div className="flex-1 h-full">
                    <AgentsDashboard />
                 </div>
                 <div className="w-1/3 h-full">
                    <AuditLogs />
                 </div>
              </div>
            )}

            {activeWorkspace === 'PORTFOLIO' && (
              <div className="absolute inset-0 flex p-6 gap-6 overflow-y-auto">
                 <div className="w-1/2 flex flex-col gap-6">
                    <PortfolioDashboard />
                    <RiskDashboard />
                 </div>
                 <div className="flex-1">
                     <ExecutionDashboard /> {/* Reusing execution dashboard to show positions */}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </StateProvider>
  );
};

const NavIcon = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => {
  return (
    <button 
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-200 ${active ? 'bg-[#FCD535]/20 text-[#1E2329]' : 'text-[#707A8A] hover:text-[#1E2329] hover:bg-[#F5F5F5]'}`}
    >
      {icon}
      {/* Tooltip */}
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1E2329] text-white text-[10px] uppercase font-mono rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap material-shadow z-50">
        {label}
      </span>
    </button>
  );
};

