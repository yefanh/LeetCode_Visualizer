export type VariableValue = any;

export interface HighlightInfo {
  indices: number[]; // Indices to highlight (e.g. [0, 1])
  color: 'yellow' | 'green' | 'red' | 'blue'; // Semantic color
  label?: string; // Optional label (e.g. "i", "j")
}

export interface SimulationStep {
  id: number;
  lineNumber: number;
  description: string;
  variables: Record<string, VariableValue>; // Generic state: { "nums": [1,2], "target": 9 }
  highlights: Record<string, HighlightInfo[]>; // Map variable name to highlights
}

export interface AlgorithmProblem {
  id: string;
  title: string;
  defaultCode: string;
  inputs: Record<string, any>; // Default inputs (e.g. { m: 3, n: 7 })
  visualConfig: {
    layout: 'grid' | 'array' | 'split'; // How to arrange visualizers
    visualizers: {
      variableName: string;
      type: 'grid' | 'array' | 'value' | 'map';
      label?: string;
    }[];
  };
  generateSteps: (inputs: any) => SimulationStep[];
}

export interface AlgorithmCategory {
  id: string;
  title: string;
  problems: AlgorithmProblem[];
}