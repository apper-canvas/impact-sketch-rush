import { motion } from 'framer-motion';

const Avatar = ({ 
  emoji, 
  name, 
  size = 'md', 
  isActive = false, 
  className = '',
  onClick,
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl'
  };

  const borderColor = isActive ? 'border-secondary' : 'border-gray-600';
  const ringColor = isActive ? 'ring-secondary/30' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizes[size]} rounded-full border-2 ${borderColor} ${ringColor} ${
        isActive ? 'ring-4' : ''
      } bg-surface flex items-center justify-center cursor-pointer transition-all duration-200 ${className}`}
      onClick={onClick}
      title={name}
      {...props}
    >
      <span className="select-none">{emoji}</span>
    </motion.div>
  );
};

export default Avatar;