// Admin Panel Theme Configuration
export const adminTheme = {
  colors: {
    background: {
      900: '#18181c', // main dark background
      800: '#23232a',
      700: '#2d2d36',
      card: '#23232a',
      cardBorder: '#23232a',
      accent: '#2563eb', // blue accent
      accentSoft: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
    text: {
      main: '#f3f4f6',
      secondary: '#a1a1aa',
      heading: '#fff',
    },
    border: '#23232a',
    tableHeader: '#23232a',
    tableRow: '#23232a',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 8px 0 rgba(0, 0, 0, 0.12)',
    lg: '0 8px 24px 0 rgba(0, 0, 0, 0.16)',
  },
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
};

// Responsive design utilities
export const responsiveStyles = {
  container: {
    base: { px: 4, py: 6 },
    md: { px: 8, py: 10 },
    lg: { px: 12, py: 16 },
  },
  card: {
    base: { p: 4, borderRadius: 'lg', boxShadow: 'md', bg: 'background.card', border: '1px solid', borderColor: 'background.cardBorder' },
    md: { p: 6 },
    lg: { p: 8 },
  },
  table: {
    base: { fontSize: 'sm', bg: 'background.card', borderRadius: 'lg', boxShadow: 'md', border: '1px solid', borderColor: 'background.cardBorder' },
    md: { fontSize: 'md' },
  },
  button: {
    base: { size: 'sm', fontWeight: 'bold', borderRadius: 'lg', bg: 'background.accent', color: 'white', boxShadow: 'md', _hover: { filter: 'brightness(1.1)', bg: 'background.accentSoft' } },
    md: { size: 'md' },
  },
};

// Common component styles
export const componentStyles = {
  adminCard: {
    bg: 'background.card',
    borderRadius: 'lg',
    boxShadow: 'md',
    p: { base: 4, md: 6 },
    border: '1px solid',
    borderColor: 'background.cardBorder',
    color: 'text.main',
  },
  adminButton: {
    borderRadius: 'lg',
    fontWeight: 'bold',
    bg: 'background.accent',
    color: 'white',
    boxShadow: 'md',
    transition: 'all 0.2s',
    _hover: {
      filter: 'brightness(1.1)',
      bg: 'background.accentSoft',
    },
  },
  adminTable: {
    variant: 'simple',
    size: { base: 'sm', md: 'md' },
    borderRadius: 'lg',
    overflow: 'hidden',
    boxShadow: 'md',
    bg: 'background.card',
    border: '1px solid',
    borderColor: 'background.cardBorder',
    color: 'text.main',
  },
  adminNavbar: {
    bg: 'background.900',
    color: 'text.main',
    px: { base: 4, md: 8, lg: 12 },
    py: { base: 3, md: 4 },
    boxShadow: 'md',
    borderBottom: '1px solid',
    borderColor: 'background.cardBorder',
    fontFamily: 'Inter, sans-serif',
  },
}; 