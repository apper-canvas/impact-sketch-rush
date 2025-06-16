import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-primary hover:bg-purple-700 text-white focus:ring-primary shadow-lg",
    secondary: "bg-secondary hover:bg-pink-600 text-white focus:ring-secondary shadow-lg",
    accent: "bg-accent hover:bg-amber-600 text-white focus:ring-accent shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-300 hover:text-white hover:bg-surface focus:ring-gray-400",
    danger: "bg-error hover:bg-red-600 text-white focus:ring-error shadow-lg"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin" />;
    }
    if (icon) {
      return <ApperIcon name={icon} size={iconSizes[size]} />;
    }
    return null;
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon()}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon()}
        </span>
      )}
    </motion.button>
  );
};

export default Button;