'use client';
import { useState, useEffect } from 'react';
import Icon from '@components/ui/Icon';

const SeoScoreWidget = ({ score = 0, size = 'medium' }) => {
  const [scorePercent, setScorePercent] = useState(0);
  
  // Calculate the sizes based on the size prop
  const getSize = () => {
    switch(size) {
      case 'small':
        return {
          container: 'h-20 w-20',
          ring: 'h-16 w-16',
          scoreText: 'text-xl',
          labelText: 'text-xs'
        };
      case 'large':
        return {
          container: 'h-40 w-40',
          ring: 'h-36 w-36',
          scoreText: 'text-4xl',
          labelText: 'text-sm'
        };
      case 'medium':
      default:
        return {
          container: 'h-32 w-32',
          ring: 'h-28 w-28',
          scoreText: 'text-3xl',
          labelText: 'text-xs'
        };
    }
  };
  
  const { container, ring, scoreText, labelText } = getSize();
  
  // Animate score from 0 to actual value
  useEffect(() => {
    const targetScore = Math.min(Math.max(score, 0), 100);
    let currentScore = 0;
    
    const animationInterval = setInterval(() => {
      if (currentScore >= targetScore) {
        clearInterval(animationInterval);
        return;
      }
      
      // Increase by larger steps initially, smaller steps as we approach target
      const step = Math.max(1, Math.floor((targetScore - currentScore) / 10));
      currentScore += step;
      setScorePercent(Math.min(currentScore, targetScore));
    }, 30);
    
    return () => clearInterval(animationInterval);
  }, [score]);
  
  // Calculate color based on score
  const getScoreColor = () => {
    if (scorePercent >= 80) return 'green';
    if (scorePercent >= 60) return 'yellow';
    return 'red';
  };
  
  const getScoreGradient = () => {
    if (scorePercent >= 80) return 'from-green-400 to-emerald-600';
    if (scorePercent >= 60) return 'from-yellow-400 to-amber-600';
    return 'from-red-400 to-rose-600';
  };
  
  const getTextColor = () => {
    if (scorePercent >= 80) return 'text-green-600';
    if (scorePercent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Calculate ring dash offset for progress indicator
  const circumference = 2 * Math.PI * 45; // Circle radius is 45
  const dashOffset = circumference - (scorePercent / 100) * circumference;
  
  return (
    <div className={`${container} flex flex-col items-center justify-center relative group`}>
      {/* Shadow effect for depth */}
      <div className={`absolute inset-0 ${ring} rounded-full bg-gray-100 filter blur-md opacity-60`}></div>
      
      <svg className={`${ring} relative z-10`} viewBox="0 0 100 100">
        {/* Background ring with gradient */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getScoreColor() === 'green' ? '#10b981' : getScoreColor() === 'yellow' ? '#f59e0b' : '#ef4444'} />
            <stop offset="100%" stopColor={getScoreColor() === 'green' ? '#059669' : getScoreColor() === 'yellow' ? '#d97706' : '#dc2626'} />
          </linearGradient>
        </defs>
        
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="6"
          className="filter drop-shadow"
        />
        
        {/* Score ring with dasharray animation */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out filter drop-shadow"
        />
      </svg>
      
      {/* Inner content with score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="bg-white rounded-full p-3 shadow-sm group-hover:shadow-md transition-shadow duration-300 transform group-hover:scale-105 transition-transform">
          <span className={`${scoreText} font-bold ${getTextColor()}`}>{scorePercent}</span>
          <span className={`${labelText} uppercase tracking-wider font-semibold text-gray-500 block text-center mt-1`}>SEO Score</span>
        </div>
      </div>
      
      {/* Animated glow effect on hover */}
      <div className={`absolute inset-0 ${ring} rounded-full bg-gradient-to-r ${getScoreGradient()} opacity-0 group-hover:opacity-10 transition-opacity duration-300 filter blur-lg`}></div>
    </div>
  );
};

export default SeoScoreWidget; 