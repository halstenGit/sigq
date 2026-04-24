// Halsten Design System Theme
// Brand colors, typography, and component styles

export const halsten = {
  // Color Palette
  colors: {
    // Neutrals - from the template
    background: '#FAFAF7',      // Light beige background
    surface: '#FFFFFF',         // White surfaces
    surfaceAlt: '#F5F5F2',      // Alternative surface
    border: '#E5E5E0',          // Border color
    borderLight: '#EFEFEB',     // Light border

    // Text colors
    textPrimary: '#0A0A0A',     // Near black
    textSecondary: '#52524E',   // Dark gray
    textTertiary: '#999999',    // Medium gray
    textHint: '#CCCCCC',        // Light gray

    // Semantic colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',

    // Interactive
    primary: '#0A0A0A',
    secondary: '#52524E',
    accent: '#EFEFE8',
  },

  // Typography
  typography: {
    fontFamily: {
      body: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Courier New', monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '40px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    '0': '0px',
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
  },

  // Border radius
  radius: {
    none: '0px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Shadow
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 6px 0 rgba(0, 0, 0, 0.12)',
    lg: '0 10px 15px 0 rgba(0, 0, 0, 0.16)',
    xl: '0 20px 25px 0 rgba(0, 0, 0, 0.2)',
  },

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Component tokens
  components: {
    button: {
      padding: '12px 16px',
      paddingSmall: '8px 12px',
      paddingLarge: '16px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      transition: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    input: {
      padding: '10px 12px',
      paddingSmall: '8px 10px',
      paddingLarge: '12px 14px',
      borderRadius: '6px',
      fontSize: '14px',
      borderWidth: '1px',
      focusOutlineWidth: '2px',
    },
    card: {
      padding: '16px',
      paddingLarge: '24px',
      borderRadius: '12px',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 600,
    },
  },
};

export type HalstenTheme = typeof halsten;
