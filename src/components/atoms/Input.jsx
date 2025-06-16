import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  
  const hasValue = internalValue.length > 0;
  const showFloatingLabel = isFocused || hasValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={showFloatingLabel ? placeholder : ''}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 bg-surface border-2 rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none ${
            error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : 'border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20'
          } ${icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />
        
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={18} />
          </div>
        )}
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: showFloatingLabel ? -28 : 0,
              scale: showFloatingLabel ? 0.85 : 1,
              color: error ? '#EF4444' : isFocused ? '#6B46C1' : '#9CA3AF'
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none font-medium origin-left ${
              icon ? 'left-11' : 'left-3'
            }`}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-error text-sm flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;