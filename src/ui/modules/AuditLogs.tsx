import React from 'react';
import { useAppState } from '../state_streamer/StateContext';
import { TerminalSquare } from 'lucide-react';

export const AuditLogs = () => {
  const { logs } = useAppState();
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 flex flex-col h-full material-shadow">
      <h3 className="font-mono text-[10px] uppercase text-[#707A8A] mb-3 tracking-widest flex items-center shrink-0">
        <TerminalSquare className="w-3 h-3 mr-1 text-[#2D62ED]" /> Audit Logs
      </h3>
      <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1.5 pr-2">
        {logs.length === 0 && (
          <div className="text-[#B7BDC6] text-center py-4">No audit events to display.</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="text-[#474D57] break-words leading-tight border-b border-[#EAECEF] pb-1.5 hover:bg-[#F8F9FA] px-1 transition-colors">
            <span className="text-[#B7BDC6]">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
            <span className="text-[#2D62ED] font-bold">{log.user || 'SYS'}</span>:{' '}
            <span className="text-[#1E2329] font-medium">{log.action}</span>
            {log.details && (
              <div className="text-[#707A8A] pl-4 mt-0.5">{JSON.stringify(log.details)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
