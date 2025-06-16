import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Timer = ({ 
  initialTime = 60, 
  isRunning = false, 
  onTimeUp,
  size = 'lg',
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (timeLeft <= 10) return '#EF4444'; // error red
    if (timeLeft <= 20) return '#F59E0B'; // warning amber
    return '#10B981'; // success green
  };

  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm' },
    md: { container: 'w-20 h-20', text: 'text-base' },
    lg: { container: 'w-24 h-24', text: 'text-lg' },
    xl: { container: 'w-32 h-32', text: 'text-xl' }
  };

  return (
    <div className={`relative ${sizes[size].container} ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor()}
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
          className="drop-shadow-lg"
        />
        
        {/* Pulse ring for urgency */}
        {timeLeft <= 10 && timeLeft > 0 && (
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={getColor()}
            strokeWidth="2"
            fill="transparent"
            className="animate-pulse-ring"
          />
        )}
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`font-display font-bold ${sizes[size].text} text-white`}
          style={{ color: getColor() }}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  );
};

export default Timer;