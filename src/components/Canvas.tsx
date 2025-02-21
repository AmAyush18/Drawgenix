import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Circle, Line, Path, Rect, TEvent } from 'fabric';
import { CanvasProps } from '../types/types';
import fabric from 'fabric/fabric-impl';

const Canvas: React.FC<CanvasProps> = ({ tool, color, strokeWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<any>(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new FabricCanvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 64,
        backgroundColor: '#ffffff'
      });

      const canvas = fabricRef.current;

      // Resize handler
      const handleResize = () => {
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight - 64);
        canvas.renderAll();
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.dispose();
      };
    }
  }, []);

  // Update drawing mode based on selected tool
  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.isDrawingMode = tool === 'pen';
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = strokeWidth;
    }

    // Remove all event listeners when tool changes
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    // Add appropriate event listeners based on current tool
    switch (tool) {
      case 'rectangle':
        setupRectangleDrawing(canvas);
        break;
      case 'circle':
        setupCircleDrawing(canvas);
        break;
      case 'arrow':
        setupArrowDrawing(canvas);
        break;
      case 'text':
        setupTextTool(canvas);
        break;
      case 'eraser':
        setupEraser(canvas);
        break;
      case 'select':
        setupSelectionTool(canvas);
        break;
    }

  }, [tool, color, strokeWidth]);

  const setupRectangleDrawing = (canvas: FabricCanvas) => {
    let startX: number, startY: number;

    canvas.on('mouse:down', (o: TEvent) => {
      const pointer = canvas.getPointer(o.e);
      isDrawing.current = true;
      startX = pointer.x;
      startY = pointer.y;

      shapeRef.current = new Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: color,
        strokeWidth: strokeWidth
      });

      canvas.add(shapeRef.current);
    });

    canvas.on('mouse:move', (o: TEvent) => {
      if (!isDrawing.current) return;

      const pointer = canvas.getPointer(o.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      shapeRef.current.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startX : pointer.x,
        top: height > 0 ? startY : pointer.y
      });

      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      isDrawing.current = false;
      shapeRef.current = null;
    });
  };

  const setupCircleDrawing = (canvas: FabricCanvas) => {
    let startX: number, startY: number;

    canvas.on('mouse:down', (o: TEvent) => {
      const pointer = canvas.getPointer(o.e);
      isDrawing.current = true;
      startX = pointer.x;
      startY = pointer.y;

      shapeRef.current = new Circle({
        left: startX,
        top: startY,
        radius: 0,
        fill: 'transparent',
        stroke: color,
        strokeWidth: strokeWidth
      });

      canvas.add(shapeRef.current);
    });

    canvas.on('mouse:move', (o: TEvent) => {
      if (!isDrawing.current) return;

      const pointer = canvas.getPointer(o.e);
      const radius = Math.sqrt(
        Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
      ) / 2;

      shapeRef.current.set({
        radius: radius,
        left: startX - radius,
        top: startY - radius
      });

      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      isDrawing.current = false;
      shapeRef.current = null;
    });
  };

  const setupArrowDrawing = (canvas: FabricCanvas) => {
    let startX: number, startY: number;

    canvas.on('mouse:down', (o: TEvent) => {
      const pointer = canvas.getPointer(o.e);
      isDrawing.current = true;
      startX = pointer.x;
      startY = pointer.y;
    });

    canvas.on('mouse:move', (o: TEvent) => {
      if (!isDrawing.current) return;
      
      if (shapeRef.current) {
        canvas.remove(shapeRef.current);
      }

      const pointer = canvas.getPointer(o.e);
      const angle = Math.atan2(pointer.y - startY, pointer.x - startX);
      
      // Create arrow line
      const line = new Line([startX, startY, pointer.x, pointer.y], {
        stroke: color,
        strokeWidth: strokeWidth
      });

      // Create arrow head
      const headLength = 20;
      const headAngle = Math.PI / 6;

      const path = new Path(`
        M ${pointer.x} ${pointer.y}
        L ${pointer.x - headLength * Math.cos(angle - headAngle)} ${pointer.y - headLength * Math.sin(angle - headAngle)}
        M ${pointer.x} ${pointer.y}
        L ${pointer.x - headLength * Math.cos(angle + headAngle)} ${pointer.y - headLength * Math.sin(angle + headAngle)}
      `, {
        stroke: color,
        strokeWidth: strokeWidth,
        fill: 'transparent'
      });

      // Group line and arrowhead
      shapeRef.current = line;
      canvas.add(line);
      canvas.add(path);
      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      isDrawing.current = false;
      shapeRef.current = null;
    });
  };

  const setupTextTool = (canvas: FabricCanvas) => {
    canvas.on('mouse:down', (o: TEvent) => {
      const pointer = canvas.getPointer(o.e);
      const text = canvas.getActiveObject();
      
      if (!text) {
        const newText = new fabric.IText('Type here', {
          left: pointer.x,
          top: pointer.y,
          fontSize: strokeWidth * 5,
          fill: color
        });
        canvas.add(newText as any);
        canvas.setActiveObject(newText as any);
        newText.enterEditing();
        canvas.renderAll();
      }
    });
  };

  const setupEraser = (canvas: FabricCanvas) => {
    canvas.on('mouse:down', (o: TEvent) => {
      const pointer = canvas.getPointer(o.e);
      const objects = canvas.getObjects();
      
      objects.forEach((obj) => {
        if (obj.containsPoint(pointer)) {
          canvas.remove(obj);
        }
      });
      
      canvas.renderAll();
    });
  };

  const setupSelectionTool = (canvas: FabricCanvas) => {
    canvas.selection = true;
    canvas.hoverCursor = 'move';
    canvas.on('mouse:down', () => {
      canvas.forEachObject((o) => {
        o.selectable = true;
      });
    });
  };

  return (
    <div className="fixed inset-0 pt-16">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Canvas;