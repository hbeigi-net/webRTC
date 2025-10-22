import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {theme === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
