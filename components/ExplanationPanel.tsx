import React from 'react';
import { SimulationStep } from '../types';

interface ExplanationPanelProps {
  step: SimulationStep;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 min-h-[100px] flex flex-col justify-center shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wide">
          Step {step.id}
        </span>
      </div>
      <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed font-medium">
        {step.description}
      </p>
    </div>
  );
};

export default ExplanationPanel;