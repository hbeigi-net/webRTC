import { createTheme, ThemeOptions } from '@mui/material/styles';

// Light theme colors
const lightColors = {
  primary: {
    main: '#007bff',
    light: '#4dabf7',
    dark: '#0056b3',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6c757d',
    light: '#adb5bd',
    dark: '#545b62',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  divider: '#dee2e6',
};

// Dark theme colors
const darkColors = {
  primary: {
    main: '#4dabf7',
    light: '#74c0fc',
    dark: '#339af0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6c757d',
    light: '#adb5bd',
    dark: '#545b62',
    contrastText: '#ffffff',
  },
  background: {
    default: '#1a1a1a',
    paper: '#2d2d2d',
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
  },
  divider: '#404040',
};

export const createMuiTheme = (isDark: boolean) => {
  const colors = isDark ? darkColors : lightColors;
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode: isDark ? 'dark' : 'light',
      ...colors,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.6,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.3s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
