import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DrawingCanvas from '@/components/organisms/DrawingCanvas';
import ChatArea from '@/components/organisms/ChatArea';
import ScoreBoard from '@/components/organisms/ScoreBoard';
import WordDisplay from '@/components/molecules/WordDisplay';
import GameStatus from '@/components/molecules/GameStatus';
import ScoreAnimation from '@/components/molecules/ScoreAnimation';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import { gameService, playerService, wordService } from '@/services';

const GamePlay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    if (game && game.gameState === 'playing') {
      startNewTurn();
    }
  }, [game?.currentDrawer, game?.currentRound]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const [currentGame, player] = await Promise.all([
        gameService.getCurrentGame(),
        playerService.getCurrentPlayer()
      ]);

      if (!currentGame || !player) {
        navigate('/lobby');
        return;
      }

      if (currentGame.gameState === 'finished') {
        navigate('/results');
        return;
      }

      const gamePlayers = await playerService.getByIds(currentGame.players);
      
      setGame(currentGame);
      setPlayers(gamePlayers);
      setCurrentPlayer(player);
      setGuesses(currentGame.guesses || []);
      setTimeRemaining(currentGame.timeRemaining || 60);
    } catch (error) {
      toast.error('Failed to load game');
      navigate('/lobby');
    } finally {
      setLoading(false);
    }
  };

  const startNewTurn = async () => {
    if (!game || !currentPlayer) return;

    try {
      // If current player is the drawer, get a new word
      if (game.currentDrawer === currentPlayer.Id) {
        const word = await wordService.getRandomWord();
        setCurrentWord(word);
        await gameService.updateGameState(game.Id, { 
          currentWord: word.word,
          timeRemaining: 60 
        });
        toast.success(`Your word: ${word.word}`);
      } else {
        setCurrentWord(null);
      }

      setTimeRemaining(60);
      setIsTimerRunning(true);
      setGuesses([]);
    } catch (error) {
      toast.error('Failed to start new turn');
    }
  };

  const handleTimeUp = async () => {
    setIsTimerRunning(false);
    
    if (!game) return;

    try {
      const updatedGame = await gameService.nextTurn(game.Id);
      
      if (updatedGame.gameState === 'finished') {
        toast.success('Game finished!');
        navigate('/results');
        return;
      }

      setGame(updatedGame);
      toast.info('Time\'s up! Next player\'s turn.');
    } catch (error) {
      toast.error('Failed to advance to next turn');
    }
  };

  const handleSubmitGuess = async (guess) => {
    if (!game || !currentPlayer || game.currentDrawer === currentPlayer.Id) return;

    try {
      const result = await gameService.submitGuess(game.Id, currentPlayer.Id, guess);
      
      setGuesses(prev => [...prev, result.guess]);
      setGame(result.game);

      if (result.isCorrect) {
        const points = Math.max(1, Math.ceil(timeRemaining / 6));
        setLastScore(points);
        setShowScoreAnimation(true);
        toast.success(`Correct! +${points} points`);
        
        // Advance to next turn after correct guess
        setTimeout(async () => {
          try {
            const updatedGame = await gameService.nextTurn(game.Id);
            if (updatedGame.gameState === 'finished') {
              navigate('/results');
            } else {
              setGame(updatedGame);
            }
          } catch (error) {
            console.error('Failed to advance turn:', error);
          }
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to submit guess');
    }
  };

  const handleSkipTurn = async () => {
    if (!game || game.currentDrawer !== currentPlayer.Id) return;

    try {
      const updatedGame = await gameService.nextTurn(game.Id);
      
      if (updatedGame.gameState === 'finished') {
        navigate('/results');
      } else {
        setGame(updatedGame);
        toast.info('Skipped turn');
      }
    } catch (error) {
      toast.error('Failed to skip turn');
    }
  };

  const isCurrentDrawer = game && currentPlayer && game.currentDrawer === currentPlayer.Id;
  const currentDrawerName = players.find(p => p.Id === game?.currentDrawer)?.name || 'Unknown';

  if (loading) {
    return (
      <div className="h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto h-full">
          <SkeletonLoader count={4} height="h-32" />
        </div>
      </div>
    );
  }

  if (!game || !currentPlayer) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Game not found</h2>
          <Button variant="primary" onClick={() => navigate('/lobby')}>
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-4 border-b border-gray-700"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-bold text-white">Sketch Rush</h1>
            <div className="text-sm text-gray-400">
              <span className="text-accent font-medium">{currentDrawerName}</span> is drawing
            </div>
          </div>
          
          <GameStatus
            currentRound={game.currentRound}
            totalRounds={3}
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            onTimeUp={handleTimeUp}
          />
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            {/* Left Column - Drawing and Word */}
            <div className="lg:col-span-2 space-y-4">
              <WordDisplay
                word={currentWord?.word}
                hint={currentWord?.hint}
                category={currentWord?.category}
                isDrawer={isCurrentDrawer}
              />
              
              <DrawingCanvas
                isDrawing={isCurrentDrawer}
                className="flex-1"
              />
              
              {isCurrentDrawer && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    icon="SkipForward"
                    onClick={handleSkipTurn}
                  >
                    Skip Turn
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Chat and Scores */}
            <div className="lg:col-span-2 flex flex-col space-y-4 min-h-0">
              <ChatArea
                guesses={guesses}
                onSubmitGuess={handleSubmitGuess}
                canGuess={!isCurrentDrawer && isTimerRunning}
                currentPlayerId={currentPlayer.Id}
                players={players}
                className="flex-1"
              />
              
              <ScoreBoard
                players={players}
                scores={game.scores || {}}
                currentDrawer={game.currentDrawer}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Score Animation */}
      <ScoreAnimation
        points={lastScore}
        isVisible={showScoreAnimation}
        onComplete={() => setShowScoreAnimation(false)}
      />
    </div>
  );
};

export default GamePlay;