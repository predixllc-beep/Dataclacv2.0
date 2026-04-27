import React from 'react';
import { useAppState } from '../state_streamer/StateContext';

export const ExecutionDashboard = () => {
  const { orders } = useAppState();

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 flex flex-col h-full material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest shrink-0">Execution Blotter</h3>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-[#EAECEF] text-[10px] font-mono text-[#707A8A] uppercase tracking-wider">
              <th className="pb-2 font-semibold pl-2">Symbol</th>
              <th className="pb-2 font-semibold text-right">Size</th>
              <th className="pb-2 font-semibold text-right pr-2">State</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono tracking-tight text-[#1E2329]">
            {orders.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-[#B7BDC6] font-medium">No active orders in session.</td>
              </tr>
            )}
            {orders.map((o, idx) => (
              <tr key={idx} className="border-b border-[#EAECEF] hover:bg-[#F8F9FA] transition-colors">
                <td className={`py-3 pl-2 font-bold ${o.side.includes('BUY') ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>{o.symbol}</td>
                <td className="py-3 text-right font-medium">{o.filled_size} / {o.total_size}</td>
                <td className="py-3 text-right pr-2">
                  <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold border ${
                    o.state === 'FILLED' ? 'bg-[#0ECB81]/10 text-[#0ECB81] border-[#0ECB81]/30' :
                    o.state === 'REJECTED' || o.state === 'CANCELED' ? 'bg-[#F6465D]/10 text-[#F6465D] border-[#F6465D]/30' :
                    'bg-[#FCD535]/10 text-[#1E2329] border-[#FCD535]/50'
                  }`}>
                    {o.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
