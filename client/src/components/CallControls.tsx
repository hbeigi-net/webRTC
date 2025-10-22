import { Box, IconButton, Tooltip, Paper } from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
} from '@mui/icons-material';

interface CallControlsProps {
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  isMicEnabled,
  isCameraEnabled,
  isScreenSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onEndCall,
}) => {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'background.paper',
        borderRadius: 6,
        padding: 2,
        zIndex: 100,
        display: 'flex',
        gap: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* Microphone Toggle */}
        <Tooltip title={isMicEnabled ? 'Mute Microphone' : 'Unmute Microphone'}>
          <IconButton
            onClick={onToggleMic}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: isMicEnabled ? 'primary.main' : 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: isMicEnabled ? 'primary.dark' : 'error.dark',
              },
              transition: 'all 0.3s ease',
            }}
            aria-label={isMicEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicEnabled ? <Mic /> : <MicOff />}
          </IconButton>
        </Tooltip>

        {/* Camera Toggle */}
        <Tooltip title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}>
          <IconButton
            onClick={onToggleCamera}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: isCameraEnabled ? 'primary.main' : 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: isCameraEnabled ? 'primary.dark' : 'error.dark',
              },
              transition: 'all 0.3s ease',
            }}
            aria-label={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isCameraEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Tooltip>

        {/* Screen Share Toggle */}
        <Tooltip title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}>
          <IconButton
            onClick={onToggleScreenShare}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: isScreenSharing ? 'success.main' : 'grey.700',
              color: 'white',
              '&:hover': {
                backgroundColor: isScreenSharing ? 'success.dark' : 'grey.800',
              },
              transition: 'all 0.3s ease',
            }}
            aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
          >
            {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Box
          sx={{
            width: 1,
            height: 40,
            backgroundColor: 'divider',
            mx: 1,
          }}
        />

        {/* End Call Button */}
        <Tooltip title="End Call">
          <IconButton
            onClick={onEndCall}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
            aria-label="End call"
          >
            <CallEnd />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default CallControls;

