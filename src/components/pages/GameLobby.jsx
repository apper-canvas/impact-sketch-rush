import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PlayerLobby from '@/components/organisms/PlayerLobby';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import { gameService, playerService } from '@/services';

const GameLobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState('initial'); // initial, creating, joining, lobby
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');

  useEffect(() => {
    loadCurrentPlayer();
  }, []);

  const loadCurrentPlayer = async () => {
    try {
      const player = await playerService.getCurrentPlayer();
      setCurrentPlayer(player);
      if (player) {
        setPlayerName(player.name);
      }
    } catch (error) {
      console.error('Failed to load current player:', error);
    }
  };

  const createPlayer = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return null;
    }

    try {
      const player = await playerService.createPlayer(playerName.trim());
      setCurrentPlayer(player);
      toast.success('Welcome to Sketch Rush!');
      return player;
    } catch (error) {
      toast.error('Failed to create player');
      return null;
    }
  };

  const handleCreateGame = async () => {
    setLoading(true);
    setGameState('creating');

    try {
      let player = currentPlayer;
      if (!player) {
        player = await createPlayer();
        if (!player) return;
      }

      const newGame = await gameService.createGame(player.Id);
      setGame(newGame);
      setPlayers([player]);
      setGameState('lobby');
      toast.success('Game created! Waiting for players...');
    } catch (error) {
      toast.error('Failed to create game');
      setGameState('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!gameId.trim()) {
      toast.error('Please enter a game ID');
      return;
    }

    setLoading(true);
    setGameState('joining');

    try {
      let player = currentPlayer;
      if (!player) {
        player = await createPlayer();
        if (!player) return;
      }

      const joinedGame = await gameService.joinGame(parseInt(gameId, 10), player.Id);
      const gamePlayers = await playerService.getByIds(joinedGame.players);
      
      setGame(joinedGame);
      setPlayers(gamePlayers);
      setGameState('lobby');
      toast.success('Joined game successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to join game');
      setGameState('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!game || !currentPlayer) return;

    try {
      await gameService.startGame(game.Id);
      toast.success('Game starting!');
      navigate('/game');
    } catch (error) {
      toast.error(error.message || 'Failed to start game');
    }
  };

  const handleLeaveGame = () => {
    setGame(null);
    setPlayers([]);
    setGameState('initial');
    toast.info('Left the game');
  };

  const addBotPlayers = async () => {
    if (!game) return;

    const botNames = ['ArtBot', 'SketchAI', 'DrawBot', 'GuessBot'];
    const remainingSlots = game.maxPlayers - players.length;
    const botsToAdd = Math.min(3, remainingSlots);

    try {
      const newBots = [];
      for (let i = 0; i < botsToAdd; i++) {
        const botName = botNames[i % botNames.length] + (Math.floor(i / botNames.length) + 1);
        const bot = await playerService.createPlayer(botName);
        await gameService.joinGame(game.Id, bot.Id);
        newBots.push(bot);
      }
      
      setPlayers(prev => [...prev, ...newBots]);
      toast.success(`Added ${botsToAdd} bot players`);
    } catch (error) {
      toast.error('Failed to add bot players');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SkeletonLoader count={1} height="h-32" className="w-64 mx-auto mb-4" />
          <p className="text-gray-400">
            {gameState === 'creating' && 'Creating game...'}
            {gameState === 'joining' && 'Joining game...'}
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby' && game) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <PlayerLobby
            players={players}
            hostId={game.hostId}
            currentPlayerId={currentPlayer?.Id}
            maxPlayers={game.maxPlayers}
            onStartGame={handleStartGame}
            onLeaveGame={handleLeaveGame}
          />
          
          {/* Add Bots Button for Testing */}
          {currentPlayer?.Id === game.hostId && players.length < game.maxPlayers && (
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                icon="Bot"
                onClick={addBotPlayers}
              >
                Add Bot Players (for testing)
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface rounded-xl p-8 w-full max-w-md border border-gray-600"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <ApperIcon name="Palette" size={48} className="text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Sketch Rush
          </h1>
          <p className="text-gray-400">Draw, guess, and compete with friends!</p>
        </div>

        {/* Player Name Input */}
        <div className="mb-6">
          <Input
            label="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            icon="User"
            required
          />
        </div>

        {/* Game Actions */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            icon="Plus"
            onClick={handleCreateGame}
            className="w-full"
            disabled={!playerName.trim()}
          >
            Create New Game
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-gray-400">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              label="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter game ID"
              icon="Hash"
            />
            <Button
              variant="secondary"
              size="lg"
              icon="LogIn"
              onClick={handleJoinGame}
              className="w-full"
              disabled={!playerName.trim() || !gameId.trim()}
            >
              Join Game
            </Button>
          </div>
        </div>

        {/* Quick Demo */}
        <div className="mt-8 p-4 bg-background rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-white mb-2 flex items-center">
            <ApperIcon name="Zap" size={16} className="mr-2 text-accent" />
            Quick Demo
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Want to try the game quickly? Create a game and add bot players to test the gameplay.
          </p>
          <Button
            variant="accent"
            size="sm"
            icon="Play"
            onClick={handleCreateGame}
            className="w-full"
            disabled={!playerName.trim()}
          >
            Start Demo Game
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;