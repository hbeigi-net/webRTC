import {
  Box,
  Button,
  Select,
  Grid,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

interface MediaDeviceSettingsProps {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  selectedAudioDeviceId: string;
  selectedAudioOutputDeviceId: string;
  selectedVideoDeviceId: string;
  switchAudioInput: (deviceId: string) => void;
  switchAudioOutput: (deviceId: string) => void;
  switchVideoInput: (deviceId: string) => void;
  refreshDevices: () => void;
  startGettingMedia: () => void;
}

const MediaDeviceSettings = ({
  audioInputDevices,
  audioOutputDevices,
  videoInputDevices,
  selectedAudioDeviceId,
  selectedAudioOutputDeviceId,
  selectedVideoDeviceId,
  switchAudioInput,
  switchAudioOutput,
  switchVideoInput,
  refreshDevices,
  startGettingMedia,
}: MediaDeviceSettingsProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Media Device Settings
      </Typography>
      
      <Grid container spacing={2}>
        {audioInputDevices.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="audio-input-device-label">Audio Input Device</InputLabel>
              <Select
                id='audio-input-device-label'
                labelId="audio-input-device-label"
                displayEmpty
                value={selectedAudioDeviceId}
                onChange={(e) => switchAudioInput(e.target.value)}
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Audio Input Device' }}
              >
                {audioInputDevices.map((device, index) => (
                  <MenuItem
                    key={device.deviceId}
                    value={device.deviceId}
                  >
                    {device.label || `Audio Input ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {audioOutputDevices.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="audio-output-device-label">Audio Output Device</InputLabel>
              <Select
                displayEmpty
                id='audio-output-device-label'
                labelId="audio-output-device-label"
                value={selectedAudioOutputDeviceId}
                onChange={(e) => switchAudioOutput(e.target.value)}
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Audio Output Device' }}
              >
                {audioOutputDevices.map((device, index) => (
                  <MenuItem
                    key={device.deviceId}
                    value={device.deviceId}
                  >
                    {device.label || `Audio Output ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {videoInputDevices.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="video-input-device-label">Video Input Device</InputLabel>
              <Select
                displayEmpty
                id='video-input-device-label'
                labelId="video-input-device-label"
                value={selectedVideoDeviceId}
                onChange={(e) => switchVideoInput(e.target.value)}
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Video Input Device' }}
              >
                {videoInputDevices.map((device, index) => (
                  <MenuItem
                    key={device.deviceId}
                    value={device.deviceId}
                  >
                    {device.label || `Video Input ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={startGettingMedia}
              fullWidth
            >
              Start Media Stream
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={refreshDevices}
              fullWidth
            >
              Refresh Devices
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MediaDeviceSettings;
