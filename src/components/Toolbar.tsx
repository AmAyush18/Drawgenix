import React from 'react';
import { 
  MousePointer, Pencil, Square, Circle, ArrowRight, 
  Type, Eraser, Undo, Redo, Download 
} from 'lucide-react';
import { Tool } from '../types/types';

interface ToolbarProps {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  setCurrentTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth
}) => {
  const tools = [
    { id: 'select' as Tool, icon: MousePointer, label: 'Select' },
    { id: 'pen' as Tool, icon: Pencil, label: 'Pen' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'arrow' as Tool, icon: ArrowRight, label: 'Arrow' },
    { id: 'text' as Tool, icon: Type, label: 'Text' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center gap-2">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id)}
            className={`p-2 rounded-lg transition-colors ${
              currentTool === tool.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-8 w-px bg-gray-200 mx-2" />

      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          title="Color picker"
        />
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-24 h-2"
          title="Stroke width"
        />
        <span className="text-sm text-gray-500 w-6">{strokeWidth}</span>
      </div>

      {/* Separator */}
      <div className="h-8 w-px bg-gray-200 mx-2" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => console.log('Undo')} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button 
          onClick={() => console.log('Redo')} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Separator */}
      <div className="h-8 w-px bg-gray-200 mx-2" />

      {/* Export */}
      <button 
        onClick={() => console.log('Export')} 
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
        title="Export"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;