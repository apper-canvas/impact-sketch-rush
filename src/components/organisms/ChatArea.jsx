import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuessInput from '@/components/molecules/GuessInput';
import ApperIcon from '@/components/ApperIcon';

const ChatArea = ({ 
  guesses = [], 
  onSubmitGuess, 
  canGuess = true,
  currentPlayerId,
  players = [],
  className = '' 
}) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guesses]);

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.Id === playerId);
    return player?.name || 'Unknown';
  };

  const getPlayerAvatar = (playerId) => {
    const player = players.find(p => p.Id === playerId);
    return player?.avatar || '❓';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-surface rounded-lg border border-gray-600 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ApperIcon name="MessageSquare" size={20} className="mr-2" />
          Guesses
        </h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <AnimatePresence initial={false}>
          {guesses.map((guess, index) => (
            <motion.div
              key={guess.Id || index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${
                guess.isCorrect ? 'bg-success/10 p-3 rounded-lg border border-success/30' : ''
              }`}
            >
              <div className="text-lg">{getPlayerAvatar(guess.playerId)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white text-sm">
                    {getPlayerName(guess.playerId)}
                  </span>
                  {guess.isCorrect && (
                    <ApperIcon name="Check" size={14} className="text-success" />
                  )}
                </div>
                
                <p className={`text-sm mt-1 break-words ${
                  guess.isCorrect ? 'text-success font-medium' : 'text-gray-300'
                }`}>
                  {guess.text}
                  {guess.isCorrect && (
                    <span className="ml-2 text-xs bg-success/20 text-success px-2 py-1 rounded">
                      Correct!
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {guesses.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-50" />
            <p>No guesses yet...</p>
            <p className="text-sm">Be the first to guess!</p>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-600">
        <GuessInput
          onSubmitGuess={onSubmitGuess}
          disabled={!canGuess}
          placeholder={canGuess ? "Type your guess..." : "Wait for your turn..."}
        />
      </div>
    </motion.div>
  );
};

export default ChatArea;