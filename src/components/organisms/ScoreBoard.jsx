import { motion } from 'framer-motion';
import PlayerCard from '@/components/molecules/PlayerCard';
import ApperIcon from '@/components/ApperIcon';

const ScoreBoard = ({ 
  players = [], 
  scores = {}, 
  currentDrawer,
  className = '' 
}) => {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = scores[a.Id] || 0;
    const scoreB = scores[b.Id] || 0;
    return scoreB - scoreA;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg border border-gray-600 ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ApperIcon name="Trophy" size={20} className="mr-2 text-accent" />
          Leaderboard
        </h3>
      </div>

      {/* Player List */}
      <div className="p-4 space-y-3">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Rank Badge */}
            <div className="absolute -left-2 -top-2 z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-accent text-black' :
                index === 1 ? 'bg-gray-400 text-black' :
                index === 2 ? 'bg-amber-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {index + 1}
              </div>
            </div>
            
            <PlayerCard
              player={player}
              isCurrentDrawer={player.Id === currentDrawer}
              score={scores[player.Id] || 0}
              className={index === 0 ? 'ring-2 ring-accent/50' : ''}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScoreBoard;