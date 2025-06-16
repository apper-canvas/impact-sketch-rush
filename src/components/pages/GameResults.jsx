import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import { gameService, playerService } from '@/services';

const GameResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const currentGame = await gameService.getCurrentGame();
      
      if (!currentGame) {
        navigate('/lobby');
        return;
      }

      const [gamePlayers, gameLeaderboard] = await Promise.all([
        playerService.getByIds(currentGame.players),
        gameService.getLeaderboard(currentGame.Id)
      ]);

      setGame(currentGame);
      setPlayers(gamePlayers);
      setLeaderboard(gameLeaderboard);
    } catch (error) {
      toast.error('Failed to load results');
      navigate('/lobby');
    } finally {
      setLoading(false);
    }
  };

  const getPlayerById = (playerId) => {
    return players.find(p => p.Id === playerId);
  };

  const handlePlayAgain = () => {
    navigate('/lobby');
    toast.info('Ready for another round?');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SkeletonLoader count={5} height="h-24" className="w-96" />
      </div>
    );
  }

  if (!game || !players.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
          <Button variant="primary" onClick={() => navigate('/lobby')}>
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }

  const winner = leaderboard[0];
  const winnerPlayer = getPlayerById(winner?.playerId);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Game Results
          </h1>
          <p className="text-gray-400">3 rounds completed</p>
        </motion.div>

        {/* Winner Section */}
        {winnerPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-accent to-secondary rounded-xl p-8 text-center mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
            >
              <ApperIcon name="Trophy" size={64} className="text-white mx-auto mb-4" />
            </motion.div>
            
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              🎉 Winner! 🎉
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Avatar 
                emoji={winnerPlayer.avatar} 
                name={winnerPlayer.name} 
                size="xl" 
              />
              <div>
                <h3 className="text-2xl font-bold text-white">{winnerPlayer.name}</h3>
                <p className="text-white/80 text-lg">{winner.score} points</p>
              </div>
            </div>
            
            <p className="text-white/90">
              Congratulations on your artistic victory!
            </p>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-xl border border-gray-600 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-600">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <ApperIcon name="BarChart3" size={24} className="mr-2 text-accent" />
              Final Standings
            </h3>
          </div>

          <div className="divide-y divide-gray-600">
            {leaderboard.map((entry, index) => {
              const player = getPlayerById(entry.playerId);
              if (!player) return null;

              const isWinner = index === 0;
              const rankColors = [
                'text-accent bg-accent/10 border-accent/20',
                'text-gray-300 bg-gray-300/10 border-gray-300/20',
                'text-amber-400 bg-amber-400/10 border-amber-400/20'
              ];
              const rankColor = rankColors[index] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';

              return (
                <motion.div
                  key={player.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 flex items-center justify-between ${
                    isWinner ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${rankColor}`}>
                      {index + 1}
                    </div>
                    
                    <Avatar 
                      emoji={player.avatar} 
                      name={player.name} 
                      size="lg" 
                    />
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {player.name}
                        {isWinner && (
                          <span className="ml-2 text-accent">👑</span>
                        )}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {entry.score} points total
                      </p>
                    </div>
                  </div>

                  {/* Performance Badges */}
                  <div className="flex items-center space-x-2">
                    {isWinner && (
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                        Champion
                      </span>
                    )}
                    {entry.score > 20 && (
                      <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm">
                        High Scorer
                      </span>
                    )}
                    {entry.score === 0 && (
                      <span className="bg-gray-600/20 text-gray-400 px-3 py-1 rounded-full text-sm">
                        Better luck next time
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <Button
            variant="primary"
            size="lg"
            icon="RotateCcw"
            onClick={handlePlayAgain}
            className="px-8"
          >
            Play Again
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            icon="Home"
            onClick={() => navigate('/lobby')}
          >
            Back to Lobby
          </Button>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <p>Game completed • {players.length} players • 3 rounds</p>
          <p className="mt-1">Thanks for playing Sketch Rush!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default GameResults;