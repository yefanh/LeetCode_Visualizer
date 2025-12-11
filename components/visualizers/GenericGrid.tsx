import React from 'react';
import { HighlightInfo } from '../../types';

interface GenericGridProps {
  data: (number | null)[][];
  highlights: HighlightInfo[];
  label?: string;
}

const GenericGrid: React.FC<GenericGridProps> = ({ data, highlights, label }) => {
  const m = data.length;
  const n = data[0]?.length || 0;

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <h3 className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider self-start">
          {label}
        </h3>
      )}
      <div 
        className="grid gap-1 bg-[#1e1e1e] p-2 rounded-lg border border-slate-700 w-full"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {data.map((row, r) => (
          <React.Fragment key={r}>
            {row.map((val, c) => {
              // Find active highlight for this cell
              const hl = highlights.find(h => h.indices[0] === r && h.indices[1] === c);
              
              let bgClass = "bg-[#2d2d30]";
              let textClass = "text-slate-500";
              let borderClass = "border-[#3e3e42]";
              let scaleClass = "";

              if (val !== null) {
                bgClass = "bg-[#3e3e42]";
                textClass = "text-slate-300";
              }

              if (hl) {
                if (hl.color === 'yellow') {
                  bgClass = "bg-yellow-500/20";
                  textClass = "text-yellow-300 font-bold";
                  borderClass = "border-yellow-500";
                  scaleClass = "scale-105 z-20 shadow-lg"; // z-20 to pop out
                } else if (hl.color === 'green') {
                  bgClass = "bg-emerald-900/40";
                  textClass = "text-emerald-400";
                  borderClass = "border-emerald-500/50";
                  scaleClass = "z-10";
                } else if (hl.color === 'red') {
                  bgClass = "bg-red-900/40";
                  textClass = "text-red-400 font-bold";
                  borderClass = "border-red-500/50";
                  scaleClass = "z-10";
                } else if (hl.color === 'blue') {
                  bgClass = "bg-blue-900/40";
                  textClass = "text-blue-400";
                  borderClass = "border-blue-500/50";
                  scaleClass = "z-10";
                }
              }

              return (
                <div 
                  key={`${r}-${c}`}
                  className={`
                    aspect-square flex items-center justify-center rounded border
                    transition-all duration-300 font-mono text-sm sm:text-base md:text-xl relative
                    ${bgClass} ${textClass} ${borderClass} ${scaleClass}
                  `}
                >
                   {val}
                   {hl && hl.label && (
                     <span className={`
                        absolute -top-3 -right-2 text-[10px] px-1.5 py-0.5 rounded shadow-sm z-30 whitespace-nowrap
                        ${hl.color === 'yellow' ? 'bg-yellow-500 text-black' : ''}
                        ${hl.color === 'green' ? 'bg-emerald-600 text-white' : ''}
                        ${hl.color === 'red' ? 'bg-red-600 text-white' : ''}
                        ${hl.color === 'blue' ? 'bg-blue-600 text-white' : ''}
                     `}>
                       {hl.label}
                     </span>
                   )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GenericGrid;