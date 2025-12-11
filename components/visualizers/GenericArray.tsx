import React from 'react';
import { HighlightInfo } from '../../types';

interface GenericArrayProps {
  data: number[];
  highlights: HighlightInfo[];
  label?: string;
}

const GenericArray: React.FC<GenericArrayProps> = ({ data, highlights, label }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <h3 className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
          {label}
        </h3>
      )}
      <div className="flex flex-wrap gap-2 p-3 bg-[#1e1e1e] rounded-lg border border-slate-700 min-h-[80px] items-center">
        {data.map((val, idx) => {
          const hl = highlights.find(h => h.indices.includes(idx));
          
          let bgClass = "bg-[#252526]";
          let textClass = "text-slate-400";
          let borderClass = "border-[#3e3e42]";
          let translateClass = "";

          if (hl) {
            if (hl.color === 'yellow') {
               bgClass = "bg-yellow-500/20";
               textClass = "text-yellow-300 font-bold";
               borderClass = "border-yellow-500";
               translateClass = "-translate-y-1 shadow-[0_4px_12px_rgba(234,179,8,0.2)]";
            } else if (hl.color === 'green') {
               bgClass = "bg-emerald-900/30";
               textClass = "text-emerald-400";
               borderClass = "border-emerald-500/50";
            } else if (hl.color === 'red') {
               bgClass = "bg-red-900/30";
               textClass = "text-red-400";
               borderClass = "border-red-500/50";
            } else if (hl.color === 'blue') {
               bgClass = "bg-blue-900/30";
               textClass = "text-blue-400";
               borderClass = "border-blue-500/50";
            }
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div 
                className={`
                  w-10 h-10 md:w-12 md:h-12 flex items-center justify-center 
                  rounded border transition-all duration-300 font-mono text-base md:text-lg
                  ${bgClass} ${textClass} ${borderClass} ${translateClass}
                `}
              >
                {val}
              </div>
              <div className="h-4 w-full flex justify-center relative">
                 <span className="text-[10px] text-slate-600 font-mono">{idx}</span>
                 {hl && hl.label && (
                    <span className={`
                        absolute top-4 text-[10px] font-bold whitespace-nowrap
                        ${hl.color === 'yellow' ? 'text-yellow-500' : ''}
                        ${hl.color === 'green' ? 'text-emerald-500' : ''}
                        ${hl.color === 'red' ? 'text-red-500' : ''}
                        ${hl.color === 'blue' ? 'text-blue-500' : ''}
                    `}>
                      {hl.label}
                    </span>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenericArray;