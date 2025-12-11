import React from 'react';
import { CATEGORIES } from '../utils/algorithms';
import { AlgorithmProblem } from '../types';
import { Folder, Code2, Lock } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  selectedProblemId: string;
  onSelectProblem: (catId: string, prob: AlgorithmProblem) => void;
  onToggleCategory: (catId: string) => void;
  expandedCategories: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  selectedProblemId, 
  onSelectProblem, 
  onToggleCategory,
  expandedCategories
}) => {
  return (
    <div className="w-64 bg-[#1e1e1e] border-r border-[#3e3e42] flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0">
      <div className="p-4 border-b border-[#3e3e42]">
        <h2 className="text-slate-200 font-bold tracking-wider flex items-center gap-2">
          <Code2 className="text-indigo-400" />
          ALGO VISION
        </h2>
      </div>

      <div className="flex-1 py-2">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategories.includes(cat.id);
          const hasProblems = cat.problems.length > 0;
          
          return (
            <div key={cat.id} className="mb-1">
              <button 
                onClick={() => onToggleCategory(cat.id)}
                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between hover:bg-[#2d2d30] transition-colors ${selectedCategory === cat.id ? 'text-indigo-400' : 'text-slate-500'}`}
              >
                {cat.title}
                {/* <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} /> */}
              </button>

              {isExpanded && (
                <div className="mt-1">
                  {hasProblems ? (
                    cat.problems.map(prob => (
                      <button
                        key={prob.id}
                        onClick={() => onSelectProblem(cat.id, prob)}
                        className={`w-full text-left px-8 py-2 text-sm border-l-2 transition-colors flex items-center gap-2
                          ${selectedProblemId === prob.id 
                            ? 'bg-[#37373d] text-white border-indigo-500' 
                            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#2a2d2e]'
                          }
                        `}
                      >
                         <span className="truncate">{prob.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-8 py-2 text-xs text-slate-600 italic flex items-center gap-2">
                      <Lock size={12} /> Coming Soon
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;