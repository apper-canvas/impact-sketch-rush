import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const GuessInput = ({ 
  onSubmitGuess, 
  disabled = false, 
  placeholder = "Type your guess...",
  className = '' 
}) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onSubmitGuess(guess.trim());
      setGuess('');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`flex space-x-2 ${className}`}
    >
      <div className="flex-1">
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          icon="MessageSquare"
          className="w-full"
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        icon="Send"
        disabled={disabled || !guess.trim()}
        className="px-4"
      />
    </motion.form>
  );
};

export default GuessInput;