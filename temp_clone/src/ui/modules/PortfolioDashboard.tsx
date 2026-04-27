import React from 'react';
import { useAppState } from '../state_streamer/StateContext';
import { DollarSign } from 'lucide-react';

export const PortfolioDashboard = () => {
  const { pnl } = useAppState();

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 h-full flex flex-col shrink-0 material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest flex items-center shrink-0">
        <DollarSign className="w-3 h-3 mr-1 text-[#FCD535]" /> Exposure Book
      </h3>
      <div className="flex flex-col space-y-3 flex-1">
        <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECEF] flex justify-between items-center material-shadow">
          <div className="text-xs font-mono text-[#707A8A] uppercase">Net Delta</div>
          <div className="text-xl font-mono font-bold text-[#2D62ED]">
            ${(pnl.net_delta_usd || 12450.0).toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 flex-1">
           <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECEF] flex flex-col justify-center items-center material-shadow">
            <div className="text-[10px] font-mono text-[#707A8A] uppercase mb-1">Realized</div>
            <div className="text-lg font-bold font-mono text-[#0ECB81]">
              ${(pnl.realized_usd || 1200.5).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>
          <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECEF] flex flex-col justify-center items-center material-shadow">
            <div className="text-[10px] font-mono text-[#707A8A] uppercase mb-1">Unrealized M2M</div>
            <div className={`text-lg font-bold font-mono ${pnl.unrealized_usd >= 0 || true ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              ${(pnl.unrealized_usd || 450.2).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
