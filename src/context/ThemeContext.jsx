import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'cyberpunk',
    name: 'Cyber Violet',
    category: 'Dark',
    description: 'Electric violet, neon cyan & futuristic deep obsidian glow',
    primaryColor: '#a855f7',
    secondaryColor: '#06b6d4',
    bgPreview: '#080718',
    cardPreview: '#161330',
    accentGradient: 'linear-gradient(135deg, #a855f7, #06b6d4)',
    badge: 'Popular',
    icon: '🔮',
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    category: 'Dark',
    description: 'Deep obsidian slate with luminous cyber emerald & mint accents',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    bgPreview: '#030d0a',
    cardPreview: '#081c16',
    accentGradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    badge: 'Fresh',
    icon: '🌿',
  },
  {
    id: 'sunset',
    name: 'Sunset Ember',
    category: 'Dark',
    description: 'Cosmic charcoal with blazing rose & radiant golden amber',
    primaryColor: '#f43f5e',
    secondaryColor: '#f59e0b',
    bgPreview: '#0e070e',
    cardPreview: '#201020',
    accentGradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
    badge: 'Vibrant',
    icon: '🔥',
  },
  {
    id: 'ocean',
    name: 'Oceanic Sapphire',
    category: 'Dark',
    description: 'Classic deep midnight navy with vivid azure & bright cyan',
    primaryColor: '#3b82f6',
    secondaryColor: '#06b6d4',
    bgPreview: '#020817',
    cardPreview: '#0f1e35',
    accentGradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    badge: 'Classic',
    icon: '🌊',
  },
  {
    id: 'midnight',
    name: 'Obsidian OLED',
    category: 'Dark',
    description: 'Pure black OLED canvas with sleek indigo highlights',
    primaryColor: '#6366f1',
    secondaryColor: '#38bdf8',
    bgPreview: '#000002',
    cardPreview: '#0e0e14',
    accentGradient: 'linear-gradient(135deg, #6366f1, #38bdf8)',
    badge: 'Stealth',
    icon: '🖤',
  },
  {
    id: 'light',
    name: 'Executive Light',
    category: 'Light',
    description: 'Crisp modern daylight theme with high-contrast clarity',
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    bgPreview: '#f8fafc',
    cardPreview: '#ffffff',
    accentGradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    badge: 'Daylight',
    icon: '☀️',
  },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('skillpilot_theme');
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved;
    }
    // Default to 'cyberpunk' (Cyber Violet) for a stunning new aesthetic
    return 'cyberpunk';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillpilot_theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (THEMES.some((t) => t.id === newTheme)) {
      setThemeState(newTheme);
    }
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
