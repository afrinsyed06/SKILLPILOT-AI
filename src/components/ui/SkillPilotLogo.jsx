import React from 'react';

/**
 * SkillPilotLogo - Bespoke vector emblem for SKILLPILOT AI
 * Metaphors:
 * - Supersonic delta pilot craft & ascending trajectory
 * - Orbital navigation trajectory ring
 * - Layered 3D aerodynamic faceted wings (Cyan & Indigo)
 * - 4-point AI neural spark / quantum compass core
 */
export default function SkillPilotLogo({
  size = 'md',
  className = '',
  iconClassName = '',
  withText = false,
  subtitle = 'AI PLACEMENT',
  animated = true,
}) {
  const sizeMap = {
    xs: { box: 'w-7 h-7', icon: 'w-5 h-5', text: 'text-xs', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', icon: 'w-5.5 h-5.5', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-base', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const iconElement = (
    <div
      className={`relative ${currentSize.box} rounded-xl flex items-center justify-center transition-all duration-300 group ${
        animated ? 'hover:scale-105 hover:shadow-[0_0_24px_rgba(6,182,212,0.45)]' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.2) 50%, rgba(6, 182, 212, 0.3) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 4px 16px -2px rgba(6, 182, 212, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Ambient glow backdrop inside the badge */}
      <div
        className="absolute inset-0 rounded-xl opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.35), transparent 70%)',
        }}
      />

      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 ${currentSize.icon} ${iconClassName}`}
        style={{ filter: 'drop-shadow(0 2px 6px rgba(6, 182, 212, 0.45))' }}
      >
        <defs>
          {/* Left Wing Facet Gradient */}
          <linearGradient id="sp-wing-l" x1="6" y1="5" x2="16" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="65%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Right Wing Facet Gradient */}
          <linearGradient id="sp-wing-r" x1="26" y1="5" x2="16" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="65%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Center Supersonic Blade Gradient */}
          <linearGradient id="sp-blade" x1="16" y1="3" x2="16" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#BAE6FD" />
            <stop offset="75%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* AI Diamond Core Gradient */}
          <linearGradient id="sp-spark" x1="11" y1="9" x2="21" y2="17" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#67E8F9" />
          </linearGradient>

          {/* Orbital Navigation Ring Gradient */}
          <linearGradient id="sp-orbit" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Orbital Trajectory Ring for Pilot Navigation Guidance */}
        <ellipse
          cx="16"
          cy="16"
          rx="13.5"
          ry="6.5"
          transform="rotate(-25 16 16)"
          stroke="url(#sp-orbit)"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity="0.85"
        />

        {/* Left Aerodynamic Delta Wing */}
        <path
          d="M 16 5.5 L 5 21.5 Q 10.5 20 16 18 Z"
          fill="url(#sp-wing-l)"
        />

        {/* Right Aerodynamic Delta Wing */}
        <path
          d="M 16 5.5 L 27 21.5 Q 21.5 20 16 18 Z"
          fill="url(#sp-wing-r)"
        />

        {/* Left Secondary Stabilizer */}
        <path
          d="M 9.5 21 L 6.5 26.5 L 13 22.5 Z"
          fill="#0284C7"
          opacity="0.95"
        />

        {/* Right Secondary Stabilizer */}
        <path
          d="M 22.5 21 L 25.5 26.5 L 19 22.5 Z"
          fill="#4338CA"
          opacity="0.95"
        />

        {/* Central Supersonic Pilot Arrowhead & Keel */}
        <path
          d="M 16 3.5 L 18 13 L 16 26 L 14 13 Z"
          fill="url(#sp-blade)"
        />

        {/* Center AI Neural Spark */}
        <path
          d="M 16 9.5 Q 16 13 19.5 13 Q 16 13 16 16.5 Q 16 13 12.5 13 Q 16 13 16 9.5 Z"
          fill="url(#sp-spark)"
        />

        {/* Glowing Luminous Quantum Center Node */}
        <circle cx="16" cy="13" r="1.3" fill="#FFFFFF" />
      </svg>
    </div>
  );

  if (!withText) {
    return iconElement;
  }

  return (
    <div className="flex items-center gap-3">
      {iconElement}
      <div>
        <div className={`${currentSize.text} font-black text-white tracking-wide leading-tight`}>
          SKILLPILOT
        </div>
        <div
          className={`${currentSize.sub} font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
