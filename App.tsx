import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CodePanel from './components/CodePanel';
import ExplanationPanel from './components/ExplanationPanel';
import GenericGrid from './components/visualizers/GenericGrid';
import GenericArray from './components/visualizers/GenericArray';
import VariableWatch from './components/visualizers/VariableWatch';
import { CATEGORIES } from './utils/algorithms';
import { SimulationStep, AlgorithmProblem } from './types';

const App: React.FC = () => {
  // Navigation State
  const [selectedCategory, setSelectedCategory] = useState<string>('arrays');
  const [selectedProblem, setSelectedProblem] = useState<AlgorithmProblem>(CATEGORIES[0].problems[0]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['arrays', 'dp']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Input State (Generic)
  const [inputs, setInputs] = useState<Record<string, any>>({});

  // Simulation State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  // Initialize inputs when problem changes
  useEffect(() => {
    setInputs(selectedProblem.inputs);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedProblem]);

  // Handle Input Changes: Reset simulation to prevent "blank screen" bug
  const handleInputChange = (key: string, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Generate Steps based on current logic and inputs
  const steps = useMemo(() => {
    // CRITICAL FIX: Crash Prevention
    // When switching problems, 'inputs' might still hold the OLD problem's data (e.g. {m,n})
    // while 'selectedProblem' is already the NEW one (e.g. Set Matrix Zeroes needing {matrix}).
    // We must ensure the current 'inputs' match what the new problem expects.
    const requiredKeys = Object.keys(selectedProblem.inputs);
    const currentKeys = Object.keys(inputs);
    
    // Check if every required key exists in current inputs
    const hasRequiredData = requiredKeys.every(key => currentKeys.includes(key));

    if (!hasRequiredData) {
      return []; // Wait for useEffect to sync inputs
    }

    try {
      return selectedProblem.generateSteps(inputs);
    } catch (e) {
      console.error("Simulation generation error:", e);
      return [];
    }
  }, [selectedProblem, inputs]);

  const currentStep = steps[currentStepIndex] || { 
    id: 0, lineNumber: 0, description: "Ready", variables: {}, highlights: {} 
  };
  const isFinished = currentStepIndex === steps.length - 1;

  const timerRef = useRef<number | null>(null);

  // Playback Logic
  useEffect(() => {
    if (isPlaying && !isFinished && steps.length > 0) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, isFinished, steps.length, speed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleSidebarSelect = (catId: string, prob: AlgorithmProblem) => {
    setSelectedCategory(catId);
    setSelectedProblem(prob);
    if (window.innerWidth < 1024) setSidebarOpen(false); // Auto close on mobile
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // --- Render Helpers ---
  const renderVisualizer = (config: { variableName: string, type: string, label?: string }) => {
    // Safety check for empty variables (during switching)
    if (!currentStep.variables) return null;

    const data = currentStep.variables[config.variableName];
    const highlights = currentStep.highlights[config.variableName] || [];

    // Explicit check for undefined only. Null is a valid value for variables.
    if (data === undefined) return null;

    switch (config.type) {
      case 'grid':
        return <GenericGrid key={config.variableName} data={data} highlights={highlights} label={config.label} />;
      case 'array':
        return <GenericArray key={config.variableName} data={data} highlights={highlights} label={config.label} />;
      case 'value':
      case 'map':
        return <VariableWatch key={config.variableName} data={data} label={config.label || config.variableName} type={config.type as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      
      {/* Mobile Menu Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0`}>
        <Sidebar 
          selectedCategory={selectedCategory}
          selectedProblemId={selectedProblem.id}
          onSelectProblem={handleSidebarSelect}
          onToggleCategory={toggleCategory}
          expandedCategories={expandedCategories}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        
        {/* Header */}
        <header className="h-16 border-b border-[#3e3e42] bg-[#1e1e1e] flex items-center justify-between px-6 shrink-0 lg:ml-0 ml-12">
          <div>
            <h1 className="text-lg font-bold text-slate-200 truncate max-w-[200px] md:max-w-none">
              {selectedProblem.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Dynamic Inputs (Simple impl for m/n/target) */}
             <div className="hidden md:flex gap-4 items-center mr-4">
               {Object.entries(inputs).map(([key, val]) => {
                 if (typeof val === 'number') {
                   return (
                     <div key={key} className="flex flex-col">
                       <label className="text-[10px] text-slate-500 uppercase font-bold">{key}</label>
                       <input 
                         type="number" 
                         value={val}
                         onChange={(e) => handleInputChange(key, Number(e.target.value))}
                         className="w-16 bg-[#2d2d30] border border-[#3e3e42] rounded px-2 text-xs h-6 focus:outline-none focus:border-indigo-500"
                       />
                     </div>
                   );
                 }
                 return null;
               })}
             </div>

             <div className="flex items-center gap-2 bg-[#2d2d30] p-1 rounded-lg">
                <button onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }} className="p-1.5 hover:bg-[#3e3e42] rounded text-slate-400"><RotateCcw size={16}/></button>
                <button onClick={handlePrev} className="p-1.5 hover:bg-[#3e3e42] rounded text-slate-400"><ChevronLeft size={16}/></button>
                <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1.5 rounded ${isPlaying ? 'bg-indigo-600 text-white' : 'hover:bg-[#3e3e42] text-slate-400'}`}>
                  {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                </button>
                <button onClick={handleNext} className="p-1.5 hover:bg-[#3e3e42] rounded text-slate-400"><ChevronRight size={16}/></button>
             </div>
          </div>
        </header>

        {/* Workspace Grid */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Code & Explanation */}
          <div className="flex flex-col gap-4 min-w-0">
            <CodePanel activeLine={currentStep.lineNumber} defaultCode={selectedProblem.defaultCode} />
            <ExplanationPanel step={currentStep} />
          </div>

          {/* Right: Visualization Canvas */}
          <div className="flex flex-col gap-4 min-w-0">
             <div className="bg-[#1e1e1e] rounded-xl border border-[#3e3e42] p-6 shadow-2xl flex flex-col items-center min-h-[400px]">
                {steps.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 italic">
                    Loading visualization...
                  </div>
                ) : (
                  selectedProblem.visualConfig.visualizers.map(viz => renderVisualizer(viz))
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;