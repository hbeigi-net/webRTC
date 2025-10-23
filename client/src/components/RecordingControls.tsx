import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';

interface RecordingControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPreviewRecordings: () => void;
}

const RecordingControls = ({
  onStartRecording,
  onStopRecording,
  onPreviewRecordings,
}: RecordingControlsProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recording Controls
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Button
            variant='contained'
            color='success'
            fullWidth
            onClick={onStartRecording}
            startIcon="🔴"
          >
            Start Recording
          </Button>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Button
            variant='contained'
            color='error'
            fullWidth
            onClick={onStopRecording}
            startIcon="⏹️"
          >
            Stop Recording
          </Button>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Button
            variant='contained'
            color='info'
            fullWidth
            onClick={onPreviewRecordings}
            startIcon="▶️"
          >
            Play Recording
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecordingControls;
