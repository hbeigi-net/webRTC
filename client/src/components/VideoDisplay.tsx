import { Box, Paper, Typography } from '@mui/material';
import { useRef } from 'react';

interface VideoDisplayProps {
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
  isLocalVideoEnabled?: boolean;
  isRemoteConnected?: boolean;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localVideoRef,
  remoteVideoRef,
  isLocalVideoEnabled = true,
  isRemoteConnected = false,
}) => {
  const defaultLocalRef = useRef<HTMLVideoElement>(null);
  const defaultRemoteRef = useRef<HTMLVideoElement>(null);

  const finalLocalRef = localVideoRef || defaultLocalRef;
  const finalRemoteRef = remoteVideoRef || defaultRemoteRef;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        height: '100%',
        width: '100%',
      }}
    >
      {/* Remote Video - Main Display */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          position: 'relative',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: { xs: '300px', md: '500px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <video
          ref={finalRemoteRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isRemoteConnected ? 'block' : 'none',
          }}
        />
        {!isRemoteConnected && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white',
              }}
            >
              👤
            </Box>
            <Typography variant="h6" color="text.secondary">
              Waiting for remote participant...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Local Video - Picture in Picture */}
      <Paper
        elevation={4}
        sx={{
          position: { xs: 'relative', md: 'absolute' },
          bottom: { md: 100 },
          right: { md: 24 },
          width: { xs: '100%', md: '280px' },
          height: { xs: '200px', md: '210px' },
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 10,
          border: (theme) => `3px solid ${theme.palette.primary.main}`,
        }}
      >
        <video
          ref={finalLocalRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isLocalVideoEnabled ? 'block' : 'none',
            transform: 'scaleX(-1)', // Mirror effect for local video
          }}
        />
        {!isLocalVideoEnabled && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.800',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
              }}
            >
              👤
            </Box>
            <Typography variant="caption" color="text.secondary">
              Camera Off
            </Typography>
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          You
        </Typography>
      </Paper>
    </Box>
  );
};

export default VideoDisplay;

