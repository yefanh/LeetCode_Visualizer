import { AlgorithmCategory, SimulationStep } from '../types';

// --- UNIQUE PATHS LOGIC (DP) ---
const generateUniquePathsSteps = (inputs: { m: number, n: number }): SimulationStep[] => {
  const { m, n } = inputs;
  const steps: SimulationStep[] = [];
  let stepId = 0;

  // Initial State
  let row = new Array(n).fill(1);
  let grid: (number | null)[][] = Array.from({ length: m }, () => Array(n).fill(null));
  for (let c = 0; c < n; c++) grid[m - 1][c] = 1;

  // Helper
  const addStep = (line: number, desc: string, activeGrid: { r: number, c: number } | null = null, activeRowIdx: number | null = null, compareRowIdx: number | null = null) => {
    const highlights: any = {};
    
    // Grid Highlights
    if (activeGrid) {
      highlights['grid'] = [{ indices: [activeGrid.r, activeGrid.c], color: 'yellow', label: 'new' }];
      // If calculating, highlight dependencies
      if (line === 8) {
         highlights['grid'].push({ indices: [activeGrid.r, activeGrid.c + 1], color: 'green', label: 'R' });
         highlights['grid'].push({ indices: [activeGrid.r + 1, activeGrid.c], color: 'green', label: 'D' });
      }
    }

    // Row Highlights
    if (activeRowIdx !== null) {
      highlights['row'] = [{ indices: [activeRowIdx], color: 'yellow', label: 'j' }];
      if (compareRowIdx !== null) {
         highlights['row'].push({ indices: [compareRowIdx], color: 'green', label: 'j+1' });
      }
    }

    steps.push({
      id: stepId++,
      lineNumber: line,
      description: desc,
      variables: {
        grid: grid.map(r => [...r]), // Copy
        row: [...row],
        m, n
      },
      highlights
    });
  };

  addStep(3, `Initialize row = [1, 1, ..., 1] (Bottom row)`);

  for (let i = 0; i < m - 1; i++) {
    const visualRow = m - 2 - i;
    addStep(5, `Start Outer Loop i=${i}. Calculating row ${visualRow}.`);

    let newRow = new Array(n).fill(1);
    for(let c = 0; c < n; c++) grid[visualRow][c] = 1; // Init visual

    addStep(6, `Initialize newRow with 1s`, { r: visualRow, c: n-1 });

    for (let j = n - 2; j >= 0; j--) {
      addStep(7, `Start Inner Loop j=${j}.`, { r: visualRow, c: j }, j);
      
      const right = newRow[j + 1];
      const down = row[j];
      newRow[j] = right + down;
      grid[visualRow][j] = newRow[j];

      addStep(8, `Calculate: ${right} (Right) + ${down} (Down) = ${newRow[j]}`, { r: visualRow, c: j }, j, j+1);
    }
    
    row = newRow;
    addStep(9, `Update row = newRow`, undefined, undefined);
  }

  addStep(10, `Return row[0] = ${row[0]}`, { r: 0, c: 0 }, 0);
  return steps;
};

// --- TWO SUM LOGIC (Arrays & Hashing) ---
const generateTwoSumSteps = (inputs: { nums: number[], target: number }): SimulationStep[] => {
  const { nums, target } = inputs;
  const steps: SimulationStep[] = [];
  let stepId = 0;
  const prevMap: Record<number, number> = {}; // val -> index

  const addStep = (line: number, desc: string, activeIdx: number | null, foundIdx: number | null = null, mapHighlight: number | null = null) => {
    const highlights: any = { nums: [], prevMap: [] };
    
    if (activeIdx !== null) {
      highlights['nums'].push({ indices: [activeIdx], color: 'yellow', label: 'i' });
    }
    if (foundIdx !== null) {
      highlights['nums'].push({ indices: [foundIdx], color: 'green', label: 'found' });
    }
    if (mapHighlight !== null) {
       // Just conceptual map highlighting
    }

    steps.push({
      id: stepId++,
      lineNumber: line,
      description: desc,
      variables: { nums: [...nums], target, prevMap: { ...prevMap }, diff: activeIdx !== null ? target - nums[activeIdx] : null },
      highlights
    });
  };

  addStep(3, `Initialize empty hash map: prevMap = {}`, null);

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const diff = target - n;

    addStep(4, `Loop i=${i}, n=${n}.`, i);
    addStep(5, `Calculate diff = target - n (${target} - ${n} = ${diff})`, i);

    if (diff in prevMap) {
      addStep(6, `Check if diff (${diff}) is in prevMap... YES! Found at index ${prevMap[diff]}.`, i, prevMap[diff]);
      addStep(7, `Return indices [${prevMap[diff]}, ${i}]`, i, prevMap[diff]);
      return steps;
    } else {
      addStep(6, `Check if diff (${diff}) is in prevMap... NO.`, i);
      prevMap[n] = i;
      addStep(8, `Add n=${n} to prevMap with index ${i}.`, i);
    }
  }
  return steps;
};

// --- SET MATRIX ZEROES LOGIC (Math & Geometry) ---
const generateSetMatrixZeroesSteps = (inputs: { matrix: number[][] }): SimulationStep[] => {
  // Deep copy initial matrix to avoid mutating input prop
  const matrix = inputs.matrix.map(row => [...row]);
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  let rowZero = false;

  const steps: SimulationStep[] = [];
  let stepId = 0;

  // Helper to add steps
  const addStep = (
    line: number, 
    desc: string, 
    highlights: { r?: number, c?: number, color?: string, label?: string }[] = []
  ) => {
    const gridHighlights: any[] = [];
    
    highlights.forEach(h => {
      if (h.r !== undefined && h.c !== undefined) {
        gridHighlights.push({ 
          indices: [h.r, h.c], 
          color: h.color || 'yellow', 
          label: h.label 
        });
      }
    });

    steps.push({
      id: stepId++,
      lineNumber: line,
      description: desc,
      variables: { 
        matrix: matrix.map(r => [...r]), // Snapshot
        rowZero,
        ROWS,
        COLS
      },
      highlights: {
        matrix: gridHighlights
      }
    });
  };

  addStep(2, "Initialize dimensions and rowZero flag.");

  // Pass 1: Mark zeroes
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isZero = matrix[r][c] === 0;
      addStep(5, `Pass 1: Checking cell [${r},${c}]...`, [{ r, c, color: 'yellow' }]);

      if (isZero) {
        addStep(7, `Found a 0 at [${r},${c}]!`, [{ r, c, color: 'red', label: 'Found 0' }]);
        
        matrix[0][c] = 0;
        addStep(8, `Mark top column marker: matrix[0][${c}] = 0`, [
          { r, c, color: 'red' }, 
          { r: 0, c, color: 'blue', label: 'Mark Col' }
        ]);

        if (r > 0) {
          matrix[r][0] = 0;
          addStep(10, `Mark left row marker: matrix[${r}][0] = 0`, [
            { r, c, color: 'red' },
            { r, c: 0, color: 'blue', label: 'Mark Row' }
          ]);
        } else {
          rowZero = true;
          addStep(12, `Current row is 0. Set rowZero = True`, [{ r, c, color: 'red' }]);
        }
      }
    }
  }

  // Pass 2: Set cells to zero using markers
  for (let r = 1; r < ROWS; r++) {
    for (let c = 1; c < COLS; c++) {
      addStep(14, `Pass 2: Checking [${r},${c}] using markers...`, [
        { r, c, color: 'yellow' },
        { r: 0, c, color: 'blue', label: 'Col Marker' },
        { r, c: 0, color: 'blue', label: 'Row Marker' }
      ]);
      
      if (matrix[0][c] === 0 || matrix[r][0] === 0) {
        matrix[r][c] = 0;
        addStep(16, `Marker found! Setting matrix[${r}][${c}] = 0`, [
           { r, c, color: 'green', label: 'Set 0' },
           { r: 0, c, color: 'blue' },
           { r, c: 0, color: 'blue' }
        ]);
      }
    }
  }

  // Handle First Col
  if (matrix[0][0] === 0) {
    addStep(19, `Checking matrix[0][0]... It is 0.`, [{ r: 0, c: 0, color: 'blue' }]);
    for (let r = 0; r < ROWS; r++) {
      matrix[r][0] = 0;
      addStep(20, `Setting first column: matrix[${r}][0] = 0`, [{ r, c: 0, color: 'green' }]);
    }
  }

  // Handle First Row
  if (rowZero) {
    addStep(23, `rowZero is True.`, []);
    for (let c = 0; c < COLS; c++) {
      matrix[0][c] = 0;
      addStep(24, `Setting first row: matrix[0][${c}] = 0`, [{ r: 0, c, color: 'green' }]);
    }
  }

  return steps;
};


// --- REGISTRY ---
export const CATEGORIES: AlgorithmCategory[] = [
  {
    id: 'arrays',
    title: 'Arrays & Hashing',
    problems: [
      {
        id: 'two-sum',
        title: '1. Two Sum',
        inputs: { nums: [2, 7, 11, 15], target: 9 },
        defaultCode: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        prevMap = {}  # val -> index

        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return []`,
        visualConfig: {
          layout: 'array',
          visualizers: [
             { variableName: 'nums', type: 'array', label: 'Input Array (nums)' },
             { variableName: 'target', type: 'value', label: 'Target' },
             { variableName: 'diff', type: 'value', label: 'Current Diff' },
             { variableName: 'prevMap', type: 'map', label: 'Hash Map (prevMap)' }
          ]
        },
        generateSteps: generateTwoSumSteps
      }
    ]
  },
  {
    id: 'dp',
    title: '1-D Dynamic Programming',
    problems: [
       {
        id: 'unique-paths',
        title: '62. Unique Paths',
        inputs: { m: 3, n: 7 },
        defaultCode: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n

        for i in range(m - 1):
            newRow = [1] * n
            for j in range(n - 2, -1, -1):
                newRow[j] = newRow[j + 1] + row[j]
            row = newRow
        return row[0]`,
        visualConfig: {
          layout: 'grid',
          visualizers: [
             { variableName: 'grid', type: 'grid', label: 'DP Grid State' },
             { variableName: 'row', type: 'array', label: 'Current Row (Optimized Memory)' }
          ]
        },
        generateSteps: generateUniquePathsSteps
      }
    ]
  },
  { id: 'two-pointers', title: 'Two Pointers', problems: [] },
  { id: 'sliding-window', title: 'Sliding Window', problems: [] },
  { id: 'stack', title: 'Stack', problems: [] },
  { id: 'binary-search', title: 'Binary Search', problems: [] },
  { id: 'linked-list', title: 'Linked List', problems: [] },
  { id: 'trees', title: 'Trees', problems: [] },
  { id: 'heap', title: 'Heap / Priority Queue', problems: [] },
  { id: 'backtracking', title: 'Backtracking', problems: [] },
  { id: 'tries', title: 'Tries', problems: [] },
  { id: 'graphs', title: 'Graphs', problems: [] },
  { id: 'advanced-graphs', title: 'Advanced Graphs', problems: [] },
  { id: '2d-dp', title: '2-D Dynamic Programming', problems: [] },
  { id: 'greedy', title: 'Greedy', problems: [] },
  { id: 'intervals', title: 'Intervals', problems: [] },
  { 
    id: 'math', 
    title: 'Math & Geometry', 
    problems: [
      {
        id: 'set-matrix-zeroes',
        title: '73. Set Matrix Zeroes',
        inputs: { 
          matrix: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
          ] 
        },
        defaultCode: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        ROWS, COLS = len(matrix), len(matrix[0])
        rowZero = False

        for r in range(ROWS):
            for c in range(COLS):
                if matrix[r][c] == 0:
                    matrix[0][c] = 0
                    if r > 0:
                        matrix[r][0] = 0
                    else:
                        rowZero = True

        for r in range(1, ROWS):
            for c in range(1, COLS):
                if matrix[0][c] == 0 or matrix[r][0] == 0:
                    matrix[r][c] = 0

        if matrix[0][0] == 0:
            for r in range(ROWS):
                matrix[r][0] = 0

        if rowZero:
            for c in range(COLS):
                matrix[0][c] = 0`,
        visualConfig: {
          layout: 'grid',
          visualizers: [
             { variableName: 'matrix', type: 'grid', label: 'Matrix State' },
             { variableName: 'rowZero', type: 'value', label: 'rowZero (Flag)' }
          ]
        },
        generateSteps: generateSetMatrixZeroesSteps
      }
    ] 
  },
  { id: 'bit-manipulation', title: 'Bit Manipulation', problems: [] },
];