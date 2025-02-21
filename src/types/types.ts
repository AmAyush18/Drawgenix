export type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'eraser';

export interface CanvasProps {
    tool: Tool;
    color: string;
    strokeWidth: number;
  }

export interface DrawingElement {
  id: string;
  type: Tool;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
}