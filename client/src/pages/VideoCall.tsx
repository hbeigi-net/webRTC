import { useState, useRef, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import VideoDisplay from '../components/VideoDisplay';
import CallControls from '../components/CallControls';
import ParticipantInfo from '../components/ParticipantInfo';
import { useNavigate } from 'react-router-dom';

const VideoCall: React.FC = () => {
  const navigate = useNavigate();

  // Video refs for WebRTC integration
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Control states
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);

  // Call duration timer
  const [duration, setDuration] = useState('00:00');
  const [seconds, setSeconds] = useState(0);

  // Format duration
  useEffect(() => {
    if (isRemoteConnected) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRemoteConnected]);

  useEffect(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    setDuration(
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    );
  }, [seconds]);

  // Control handlers - these will be connected to WebRTC functionality
  const handleToggleMic = () => {
    setIsMicEnabled((prev) => !prev);
    // TODO: Implement WebRTC audio track toggle
    console.log('Microphone toggled:', !isMicEnabled);
  };

  const handleToggleCamera = () => {
    setIsCameraEnabled((prev) => !prev);
    // TODO: Implement WebRTC video track toggle
    console.log('Camera toggled:', !isCameraEnabled);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing((prev) => !prev);
    // TODO: Implement screen sharing functionality
    console.log('Screen sharing toggled:', !isScreenSharing);
  };

  const handleEndCall = () => {
    // TODO: Implement cleanup and connection closing
    console.log('Call ended');
    // Navigate back to home or previous page
    navigate('/');
  };

  // Simulate remote connection after 2 seconds (for demo purposes)
  // Remove this in production and use actual WebRTC connection events
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoteConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Account for header
        backgroundColor: 'background.default',
        paddingTop: 3,
        paddingBottom: 12, // Extra padding for controls
      }}
    >
      <Container maxWidth="xl">
        {/* Participant Information */}
        <ParticipantInfo
          localName="You"
          remoteName="Remote User"
          isConnected={isRemoteConnected}
          connectionQuality="good"
          duration={duration}
        />

        {/* Video Display Area */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: '500px', md: '600px' },
          }}
        >
          <VideoDisplay
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            isLocalVideoEnabled={isCameraEnabled}
            isRemoteConnected={isRemoteConnected}
          />
        </Box>
      </Container>

      {/* Call Controls */}
      <CallControls
        isMicEnabled={isMicEnabled}
        isCameraEnabled={isCameraEnabled}
        isScreenSharing={isScreenSharing}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onEndCall={handleEndCall}
      />
    </Box>
  );
};

export default VideoCall;

