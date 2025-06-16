import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DrawingCanvas = ({ 
  isDrawing = false, 
  onStrokeComplete,
  className = '' 
}) => {
  const canvasRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);
  const [strokes, setStrokes] = useState([]);

  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
  const sizes = [2, 3, 5, 8];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    if (!isDrawing) return;
    
    setIsDrawingMode(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newStroke = {
      tool: currentTool,
      color: currentColor,
      size: currentSize,
      points: [{ x, y }]
    };
    
    setStrokes(prev => [...prev, newStroke]);
  };

  const draw = (e) => {
    if (!isDrawingMode || !isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStrokes(prev => {
      const newStrokes = [...prev];
      const currentStroke = newStrokes[newStrokes.length - 1];
      currentStroke.points.push({ x, y });
      return newStrokes;
    });
    
    drawStroke(e);
  };

  const stopDrawing = () => {
    if (isDrawingMode) {
      setIsDrawingMode(false);
      onStrokeComplete?.(strokes);
    }
  };

  const drawStroke = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  if (!isDrawing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg border-2 border-gray-300 aspect-[4/3] flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <ApperIcon name="Eye" size={48} className="mx-auto mb-3" />
          <p className="text-lg font-medium">Watching the artist draw...</p>
          <p className="text-sm">Guess what they're drawing!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg border-2 border-gray-300 overflow-hidden ${className}`}
    >
      {/* Drawing Tools */}
      <div className="bg-gray-100 p-3 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Tool Selection */}
            <div className="flex space-x-1">
              <Button
                variant={currentTool === 'pen' ? 'primary' : 'ghost'}
                size="sm"
                icon="PenTool"
                onClick={() => setCurrentTool('pen')}
              />
              <Button
                variant={currentTool === 'eraser' ? 'primary' : 'ghost'}
                size="sm"
                icon="Eraser"
                onClick={() => setCurrentTool('eraser')}
              />
            </div>
            
            {/* Color Selection */}
            {currentTool === 'pen' && (
              <div className="flex space-x-1">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-6 h-6 rounded border-2 ${
                      currentColor === color ? 'border-gray-800' : 'border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            
            {/* Size Selection */}
            <div className="flex space-x-1">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`w-6 h-6 rounded border flex items-center justify-center text-xs font-medium ${
                    currentSize === size 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-400 bg-white text-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon="RotateCcw"
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </div>
      </div>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full aspect-[4/3] cursor-crosshair block"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </motion.div>
  );
};

export default DrawingCanvas;