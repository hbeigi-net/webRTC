import {
  Box,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
} from '@mui/material';

interface ScreenShareSettingsProps {
  isScreenSharing: boolean;
  screenShareAudio: boolean;
  screenShareWidth: number;
  screenShareHeight: number;
  screenShareError: string | null;
  onShareScreen: () => void;
  onAudioToggle: (checked: boolean) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

const ScreenShareSettings = ({
  isScreenSharing,
  screenShareAudio,
  screenShareWidth,
  screenShareHeight,
  screenShareError,
  onShareScreen,
  onAudioToggle,
  onWidthChange,
  onHeightChange,
}: ScreenShareSettingsProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Screen Share Settings
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Button
            variant='contained'
            color={isScreenSharing ? 'error' : 'secondary'}
            fullWidth
            size="large"
            onClick={onShareScreen}
            startIcon={isScreenSharing ? '⏹️' : '📺'}
          >
            {isScreenSharing ? 'Stop Screen Share' : 'Start Screen Share'}
          </Button>
          {screenShareError && (
            <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
              {screenShareError}
            </Typography>
          )}
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Screen Share Options
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={screenShareAudio}
                onChange={(e) => onAudioToggle(e.target.checked)}
                color="primary"
              />
            }
            label="Include Audio in Screen Share"
          />
        </Grid>
        
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Width (px)"
            type="number"
            value={screenShareWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            size="small"
            fullWidth
          />
        </Grid>
        
        <Grid size={{ xs: 6 }}>
          <TextField
            label="Height (px)"
            type="number"
            value={screenShareHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            size="small"
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScreenShareSettings;
