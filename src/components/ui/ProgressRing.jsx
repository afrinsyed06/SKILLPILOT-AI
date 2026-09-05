import { useEffect, useState } from 'react';

export default function ProgressRing({ percent, size = 120, strokeWidth = 10, color = '#3b82f6', label, sublabel }) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percent), 300);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none px-2 text-center">
        {label && (
          <span
            className="font-extrabold text-white tracking-tight leading-none drop-shadow-md"
            style={{ fontSize: size < 100 ? '1.25rem' : size < 130 ? '1.5rem' : '1.75rem' }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="font-semibold text-slate-200 tracking-wide uppercase mt-1 leading-none drop-shadow"
            style={{ fontSize: size < 100 ? '10px' : '11px' }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
