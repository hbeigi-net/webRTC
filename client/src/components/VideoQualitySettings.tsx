import {
  Box,
  Slider,
  Typography,
} from '@mui/material';

interface VideoQualitySettingsProps {
  videoRefreshRate: number;
  videoFrameRateConstraints: { min: number; max: number };
  handleFrameRateChange: (event: unknown, newValue: number) => void;
}

const VideoQualitySettings = ({
  videoRefreshRate,
  videoFrameRateConstraints,
  handleFrameRateChange,
}: VideoQualitySettingsProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Video Quality Settings
      </Typography>
      
      <Box sx={{ px: 2 }}>
        <Typography variant="body1" gutterBottom>
          Frame Rate: {videoRefreshRate} FPS
        </Typography>
        <Slider
          value={videoRefreshRate}
          onChange={handleFrameRateChange}
          min={videoFrameRateConstraints.min}
          max={videoFrameRateConstraints.max}
          step={5}
          valueLabelDisplay="auto"
          marks={[
            { value: videoFrameRateConstraints.min, label: `${videoFrameRateConstraints.min} FPS` },
            { value: videoFrameRateConstraints.max, label: `${videoFrameRateConstraints.max} FPS` }
          ]}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Min: {videoFrameRateConstraints.min} FPS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max: {videoFrameRateConstraints.max} FPS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoQualitySettings;
