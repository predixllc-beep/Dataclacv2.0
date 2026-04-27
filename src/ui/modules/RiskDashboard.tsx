import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';
import { useAppState } from '../state_streamer/StateContext';

export const RiskDashboard = () => {
  const { pnl } = useAppState();

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 flex flex-col h-full material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest flex items-center shrink-0">
        <ShieldAlert className="w-3 h-3 mr-1 text-[#FCD535]" /> Risk Engine
      </h3>
      
      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F8F9FA] border border-[#EAECEF] p-3 rounded-lg material-shadow">
             <div className="text-[10px] font-mono text-[#707A8A] uppercase mb-1">Max Position Size</div>
             <div className="text-sm font-mono text-[#1E2329] font-bold">$5,000.00</div>
          </div>
          <div className="bg-[#F8F9FA] border border-[#EAECEF] p-3 rounded-lg material-shadow">
             <div className="text-[10px] font-mono text-[#707A8A] uppercase mb-1">Max Drawdown Limit</div>
             <div className="text-sm font-mono text-[#1E2329] font-bold">15.0%</div>
          </div>
        </div>

        <div className="bg-[#F8F9FA] border border-[#EAECEF] p-3 rounded-lg material-shadow">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-[#707A8A] uppercase">Current Drawdown</span>
              <span className="text-[10px] font-mono text-[#0ECB81] font-bold">1.2%</span>
           </div>
           <div className="w-full bg-[#EAECEF] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#0ECB81] h-1.5 rounded-full" style={{ width: '8%' }}></div>
           </div>
        </div>
        
        <div className="bg-[#F8F9FA] border border-[#EAECEF] p-3 rounded-lg material-shadow">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-[#707A8A] uppercase">Margin Utilization</span>
              <span className="text-[10px] font-mono text-[#2D62ED] font-bold">45.5%</span>
           </div>
           <div className="w-full bg-[#EAECEF] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#2D62ED] h-1.5 rounded-full" style={{ width: '45.5%' }}></div>
           </div>
        </div>
      </div>
    </div>
  );
};
