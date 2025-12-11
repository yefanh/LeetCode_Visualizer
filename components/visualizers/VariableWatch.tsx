import React from 'react';

interface VariableWatchProps {
  data: any;
  label: string;
  type: 'value' | 'map';
}

const VariableWatch: React.FC<VariableWatchProps> = ({ data, label, type }) => {
  return (
    <div className="flex flex-col mb-4">
      <h3 className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
        {label}
      </h3>
      
      {type === 'value' && (
        <div className="bg-[#1e1e1e] border border-slate-700 px-3 py-2 rounded text-slate-200 font-mono text-sm shadow-inner">
           {data === null ? <span className="text-slate-500 italic">null</span> : String(data)}
        </div>
      )}

      {type === 'map' && (
        <div className="bg-[#1e1e1e] border border-slate-700 rounded p-2 flex flex-wrap gap-2 text-xs font-mono">
           {!data || Object.keys(data).length === 0 ? (
             <span className="text-slate-600 italic">Empty</span>
           ) : (
             Object.entries(data).map(([k, v]) => (
               <div key={k} className="px-2 py-1 bg-[#2d2d30] rounded border border-[#3e3e42] text-slate-300">
                 <span className="text-purple-400">{k}</span>: <span className="text-emerald-400">{String(v)}</span>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
};

export default VariableWatch;