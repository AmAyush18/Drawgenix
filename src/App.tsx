import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import { Tool } from './types/types';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar
        currentTool={currentTool as any}
        setCurrentTool={setCurrentTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />
      <Canvas
        tool={currentTool}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default App;