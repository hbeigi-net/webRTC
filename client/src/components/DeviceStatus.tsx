import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { useState } from 'react';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  VolumeUp,
  Settings
} from '@mui/icons-material';

interface DeviceStatusProps {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  selectedAudioDeviceId: string;
  selectedAudioOutputDeviceId: string;
  selectedVideoDeviceId: string;
  isMuted: boolean;
  isVideoOff: boolean;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onAudioDeviceChange: (deviceId: string) => void;
  onVideoDeviceChange: (deviceId: string) => void;
}

const DeviceStatus = ({
  audioInputDevices,
  audioOutputDevices,
  videoInputDevices,
  selectedAudioDeviceId,
  selectedAudioOutputDeviceId,
  selectedVideoDeviceId,
  isMuted,
  isVideoOff,
  onMuteToggle,
  onVideoToggle,
  onAudioDeviceChange,
  onVideoDeviceChange,
}: DeviceStatusProps) => {
  const [audioMenuAnchor, setAudioMenuAnchor] = useState<null | HTMLElement>(null);
  const [videoMenuAnchor, setVideoMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAudioMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAudioMenuAnchor(event.currentTarget);
  };

  const handleVideoMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setVideoMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAudioMenuAnchor(null);
    setVideoMenuAnchor(null);
  };

  const getCurrentAudioDevice = () => {
    const device = audioInputDevices.find(d => d.deviceId === selectedAudioDeviceId);
    return device?.label || 'Default Microphone';
  };

  const getCurrentVideoDevice = () => {
    const device = videoInputDevices.find(d => d.deviceId === selectedVideoDeviceId);
    return device?.label || 'Default Camera';
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {/* Microphone Status */}
      <Chip
        icon={isMuted ? <MicOff /> : <Mic />}
        label={isMuted ? 'Muted' : 'Unmuted'}
        color={isMuted ? 'error' : 'success'}
        variant="outlined"
        size="small"
        onClick={onMuteToggle}
        sx={{ cursor: 'pointer' }}
      />

      {/* Video Status */}
      <Chip
        icon={isVideoOff ? <VideocamOff /> : <Videocam />}
        label={isVideoOff ? 'Video Off' : 'Video On'}
        color={isVideoOff ? 'error' : 'success'}
        variant="outlined"
        size="small"
        onClick={onVideoToggle}
        sx={{ cursor: 'pointer' }}
      />

      {/* Audio Device Selector */}
      <IconButton
        size="small"
        onClick={handleAudioMenuOpen}
        sx={{ color: 'white' }}
      >
        <VolumeUp />
      </IconButton>
      <Menu
        anchorEl={audioMenuAnchor}
        open={Boolean(audioMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <MenuItem disabled>
          <ListItemText primary="Audio Input" />
        </MenuItem>
        {audioInputDevices.map((device, index) => (
          <MenuItem
            key={device.deviceId}
            onClick={() => {
              onAudioDeviceChange(device.deviceId);
              handleMenuClose();
            }}
            selected={device.deviceId === selectedAudioDeviceId}
          >
            <ListItemIcon>
              <Mic />
            </ListItemIcon>
            <ListItemText 
              primary={device.label || `Microphone ${index + 1}`}
              secondary={device.deviceId === selectedAudioDeviceId ? 'Current' : ''}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem disabled>
          <ListItemText primary="Audio Output" />
        </MenuItem>
        {audioOutputDevices.map((device, index) => (
          <MenuItem
            key={device.deviceId}
            onClick={() => handleMenuClose()}
            selected={device.deviceId === selectedAudioOutputDeviceId}
          >
            <ListItemIcon>
              <VolumeUp />
            </ListItemIcon>
            <ListItemText 
              primary={device.label || `Speaker ${index + 1}`}
              secondary={device.deviceId === selectedAudioOutputDeviceId ? 'Current' : ''}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Video Device Selector */}
      <IconButton
        size="small"
        onClick={handleVideoMenuOpen}
        sx={{ color: 'white' }}
      >
        <Videocam />
      </IconButton>
      <Menu
        anchorEl={videoMenuAnchor}
        open={Boolean(videoMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <MenuItem disabled>
          <ListItemText primary="Video Input" />
        </MenuItem>
        {videoInputDevices.map((device, index) => (
          <MenuItem
            key={device.deviceId}
            onClick={() => {
              onVideoDeviceChange(device.deviceId);
              handleMenuClose();
            }}
            selected={device.deviceId === selectedVideoDeviceId}
          >
            <ListItemIcon>
              <Videocam />
            </ListItemIcon>
            <ListItemText 
              primary={device.label || `Camera ${index + 1}`}
              secondary={device.deviceId === selectedVideoDeviceId ? 'Current' : ''}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Current Device Info */}
      <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          🎤 {getCurrentAudioDevice()}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          📹 {getCurrentVideoDevice()}
        </Typography>
      </Box>
    </Box>
  );
};

export default DeviceStatus;
