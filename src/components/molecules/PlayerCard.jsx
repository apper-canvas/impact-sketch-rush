import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const PlayerCard = ({ 
  player, 
  isCurrentDrawer = false, 
  isHost = false,
  score = 0,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-4 border-2 ${
        isCurrentDrawer ? 'border-secondary shadow-lg shadow-secondary/20' : 'border-gray-600'
      } ${className}`}
    >
      <div className="flex items-center space-x-3">
        <Avatar 
          emoji={player.avatar} 
          name={player.name} 
          size="md" 
          isActive={isCurrentDrawer}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white truncate">{player.name}</h3>
            {isHost && (
              <ApperIcon name="Crown" size={16} className="text-accent" />
            )}
            {isCurrentDrawer && (
              <ApperIcon name="Paintbrush" size={16} className="text-secondary" />
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-400">
              Score: <span className="text-accent font-medium">{score}</span>
            </span>
            
            {player.hasGuessed && (
              <div className="flex items-center text-success text-xs">
                <ApperIcon name="Check" size={12} className="mr-1" />
                Guessed
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isCurrentDrawer && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mt-3 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"
        />
      )}
    </motion.div>
  );
};

export default PlayerCard;