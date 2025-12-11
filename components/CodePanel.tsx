import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Bug, GripHorizontal, RotateCcw } from 'lucide-react';

interface CodePanelProps {
  activeLine: number;
  defaultCode: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ activeLine, defaultCode }) => {
  const [code, setCode] = useState(defaultCode);
  const [height, setHeight] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Update code when defaultCode changes (problem switch)
  useEffect(() => {
    setCode(defaultCode);
  }, [defaultCode]);

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      setHeight(Math.max(200, newHeight)); // Min height 200px
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Sync scrolling between textarea and background layers
  const handleScroll = () => {
    if (textareaRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
      if (highlightLayerRef.current) highlightLayerRef.current.scrollTop = scrollTop;
    }
  };

  // Auto-scroll to active line when it changes
  useEffect(() => {
    if (textareaRef.current && activeLine > 0) {
      const lineHeight = 24;
      const targetTop = (activeLine - 1) * lineHeight;
      const containerHeight = textareaRef.current.clientHeight;
      
      textareaRef.current.scrollTo({
         top: targetTop - containerHeight / 2 + lineHeight / 2,
         behavior: 'smooth'
      });
    }
  }, [activeLine]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      setCode(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lines = code.split('\n');
  const lineCount = lines.length;
  const lineHeightClass = "leading-6";
  const paddingTop = "16px"; 
  const paddingBottom = "16px";
  // Calculate total scrollable height to ensure sync
  const totalHeight = lineCount * 24 + 32; // 24px per line + padding

  return (
    <div 
      ref={panelRef}
      style={{ height: `${height}px` }}
      className="bg-[#1e1e1e] rounded-xl border border-slate-700 overflow-hidden font-mono text-sm shadow-2xl ring-1 ring-white/10 flex flex-col relative transition-all duration-75"
    >
      <div className="bg-[#252526] px-4 py-3 border-b border-[#3e3e42] flex items-center justify-between shrink-0 select-none">
        <span className="text-[#cccccc] text-xs font-bold tracking-wider uppercase flex items-center gap-2">
          <Bug size={14} className="text-yellow-500" />
          <span className="text-slate-300">Solution.py</span>
          <span className="px-2 py-0.5 rounded-full bg-[#3e3e42] text-[10px] text-slate-400">EDITABLE</span>
        </span>
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setCode(defaultCode)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Reset Code"
            >
                <RotateCcw size={14} />
            </button>
            <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
        </div>
      </div>

      <div className="relative flex-1 bg-[#1e1e1e] overflow-hidden">
        {/* Highlight Layer */}
        <div ref={highlightLayerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div style={{ height: `${totalHeight}px`, paddingTop, paddingBottom }}>
            <div 
              style={{ top: `${(activeLine - 1) * 24 + 16}px` }}
              className="absolute left-0 right-0 h-6 bg-[#37373d] border-l-2 border-[#ffd700] transition-all duration-100"
            ></div>
          </div>
        </div>

        {/* Line Numbers Layer */}
        <div ref={lineNumbersRef} className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e42] z-10 overflow-hidden text-right text-[#6e7681] select-none pointer-events-none">
          <div style={{ height: `${totalHeight}px`, paddingTop, paddingBottom }} className="px-2">
            {lines.map((_, i) => {
               const isCurrent = (i + 1) === activeLine;
               return (
                 <div key={i} className={`${lineHeightClass} h-6 flex justify-end items-center pr-1 relative`}>
                   <span className={`${isCurrent ? 'text-[#c5c5c5] font-bold' : ''}`}>{i + 1}</span>
                   {isCurrent && <ArrowRight size={12} className="text-[#ffd700] absolute -right-2 top-1.5" strokeWidth={3}/>}
                 </div>
               )
            })}
          </div>
        </div>

        {/* Textarea Layer */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          className={`
             absolute inset-0 pl-14 pt-4 pb-4 pr-4 w-full h-full 
             bg-transparent text-[#d4d4d4] resize-none outline-none 
             font-mono text-[13px] md:text-sm ${lineHeightClass}
             custom-scrollbar z-20 whitespace-pre
          `}
        />
      </div>

      <div 
        onMouseDown={() => setIsResizing(true)}
        className="h-4 bg-[#252526] border-t border-[#3e3e42] flex items-center justify-center cursor-row-resize hover:bg-[#3e3e42] transition-colors shrink-0 z-50 group"
        title="Drag to resize"
      >
        <GripHorizontal size={16} className="text-slate-600 group-hover:text-slate-400" />
      </div>
    </div>
  );
};

export default CodePanel;