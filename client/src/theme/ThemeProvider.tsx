import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import { createMuiTheme } from './muiTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const MuiThemeProviderWrapper = ({ children }: ThemeProviderProps) => {
  const { theme } = useTheme();
  const muiTheme = createMuiTheme(theme === 'dark');

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
