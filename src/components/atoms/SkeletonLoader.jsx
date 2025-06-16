const SkeletonLoader = ({ count = 3, height = 'h-20', className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`animate-pulse ${height} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg`}></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;