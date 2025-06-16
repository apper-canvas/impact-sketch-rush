import { motion, AnimatePresence } from 'framer-motion';

const ScoreAnimation = ({ points, isVisible, onComplete }) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -20 }}
          exit={{ opacity: 0, scale: 1.2, y: -60 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-accent to-secondary text-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-2xl font-display font-bold">+{points} points!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoreAnimation;