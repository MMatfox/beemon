// src/themes.js
export const lightTheme = {
  background: '#F0F0F0',
  cardBackground: '#FFFFFF',
  text: '#1F2937',
  subtleText: '#6B7280',
  borderColor: '#E5E7EB',
  primary: '#FBBF24',
  primaryText: '#FFFFFF',
  secondaryButtonBackground: '#E5E7EB',
  secondaryButtonText: '#1F2937',
  statusBar: 'dark-content',
  danger: '#EF4444',
  chartColor: (o = 1) => `rgba(55,65,81,${o})`,
  chartBackgroundColor: '#FFFFFF',
  tooltipBackground: 'rgba(0,0,0,0.75)',
  tooltipText: '#FFFFFF',
};

export const darkTheme = {
  ...lightTheme,
  background: '#111827',
  cardBackground: '#1F2937',
  text: '#F3F4F6',
  subtleText: '#9CA3AF',
  borderColor: '#374151',
  statusBar: 'light-content',
  danger: '#F87171',
  chartColor: (o = 1) => `rgba(209,213,219,${o})`,
  chartBackgroundColor: '#1F2937',
  tooltipBackground: 'rgba(255,255,255,0.85)',
  tooltipText: '#111827',
};
