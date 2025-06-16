import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const WordDisplay = ({ 
  word, 
  hint, 
  category,
  isDrawer = false,
  className = '' 
}) => {
  if (!word && isDrawer) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-surface rounded-lg p-6 text-center border-2 border-dashed border-gray-600 ${className}`}
      >
        <ApperIcon name="Eye" size={48} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400 text-lg">Waiting for word...</p>
      </motion.div>
    );
  }

  if (isDrawer && word) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-center ${className}`}
      >
        <div className="flex items-center justify-center mb-2">
          <ApperIcon name="Eye" size={20} className="text-white mr-2" />
          <span className="text-white/80 text-sm font-medium">Your word is:</span>
        </div>
        
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          {word}
        </h2>
        
        {category && (
          <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            {category}
          </span>
        )}
      </motion.div>
    );
  }

  // For guessers - show hint only
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface rounded-lg p-6 text-center border-2 border-accent ${className}`}
    >
      <div className="flex items-center justify-center mb-2">
        <ApperIcon name="Lightbulb" size={20} className="text-accent mr-2" />
        <span className="text-gray-300 text-sm font-medium">Hint:</span>
      </div>
      
      <p className="text-xl font-semibold text-white">
        {hint || 'No hint available'}
      </p>
      
      {category && (
        <span className="inline-block bg-accent/20 text-accent text-sm px-3 py-1 rounded-full mt-3">
          Category: {category}
        </span>
      )}
    </motion.div>
  );
};

export default WordDisplay;