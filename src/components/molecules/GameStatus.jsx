import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Timer from '@/components/atoms/Timer';

const GameStatus = ({ 
  currentRound, 
  totalRounds = 3, 
  timeRemaining, 
  isTimerRunning,
  onTimeUp,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-4 border border-gray-600 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" size={20} className="text-accent" />
            <span className="text-white font-medium">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          
          <div className="flex space-x-1">
            {[...Array(totalRounds)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentRound ? 'bg-success' : 
                  i === currentRound - 1 ? 'bg-accent' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Timer
          initialTime={60}
          isRunning={isTimerRunning}
          onTimeUp={onTimeUp}
          size="md"
        />
      </div>
    </motion.div>
  );
};

export default GameStatus;