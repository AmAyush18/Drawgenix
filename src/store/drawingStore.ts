import { create } from 'zustand';
import { Tool } from '../types/types';

interface DrawingState {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  undo: () => void;
  redo: () => void;
}

export const useDrawingStore = create<DrawingState>()((set) => ({
  currentTool: 'select',
  setCurrentTool: (tool) => set({ currentTool: tool }),
  color: '#000000',
  setColor: (color) => set({ color }),
  strokeWidth: 2,
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  undo: () => {/* Implement undo logic */},
  redo: () => {/* Implement redo logic */}
}));
