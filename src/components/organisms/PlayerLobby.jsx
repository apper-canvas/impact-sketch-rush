import { motion } from 'framer-motion';
import PlayerCard from '@/components/molecules/PlayerCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PlayerLobby = ({ 
  players = [], 
  hostId, 
  currentPlayerId, 
  maxPlayers = 10,
  onStartGame,
  onLeaveGame,
  className = '' 
}) => {
  const emptySlots = Math.max(0, maxPlayers - players.length);
  const canStart = players.length >= 2;
  const isHost = currentPlayerId === hostId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Game Lobby
        </h2>
        <p className="text-gray-400">
          {players.length} of {maxPlayers} players • Minimum 2 players to start
        </p>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Current Players */}
        {players.map((player, index) => (
          <motion.div
            key={player.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlayerCard
              player={player}
              isHost={player.Id === hostId}
              score={0}
            />
          </motion.div>
        ))}
        
        {/* Empty Slots */}
        {[...Array(emptySlots)].map((_, index) => (
          <motion.div
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (players.length + index) * 0.1 }}
            className="bg-surface/50 rounded-lg p-4 border-2 border-dashed border-gray-600 flex items-center justify-center"
          >
            <div className="text-center text-gray-500">
              <ApperIcon name="UserPlus" size={32} className="mx-auto mb-2" />
              <p className="text-sm">Waiting for player...</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        {isHost ? (
          <Button
            variant="primary"
            size="lg"
            icon="Play"
            onClick={onStartGame}
            disabled={!canStart}
            className="px-8"
          >
            {canStart ? 'Start Game' : `Need ${2 - players.length} more players`}
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-2">Waiting for host to start the game...</p>
            <div className="flex items-center justify-center text-accent">
              <ApperIcon name="Crown" size={16} className="mr-1" />
              Host: {players.find(p => p.Id === hostId)?.name}
            </div>
          </div>
        )}
        
        <Button
          variant="outline"
          size="lg"
          icon="LogOut"
          onClick={onLeaveGame}
        >
          Leave Game
        </Button>
      </div>

      {/* Game Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface rounded-lg p-6 border border-gray-600"
      >
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <ApperIcon name="Info" size={20} className="mr-2 text-info" />
          How to Play
        </h3>
        <div className="space-y-2 text-gray-300 text-sm">
          <p>• Players take turns drawing words while others guess</p>
          <p>• Each round lasts 60 seconds</p>
          <p>• Faster correct guesses earn more points</p>
          <p>• Game consists of 3 rounds total</p>
          <p>• Player with the most points wins!</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlayerLobby;