import {
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import MediaDeviceSettings from './MediaDeviceSettings';
import ScreenShareSettings from './ScreenShareSettings';

interface MediaControlBarProps {
  // Media Device Settings
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

  // Screen Share Settings
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

const MediaControlBar = ({
  // Media Device Settings
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

  // Screen Share Settings
  isScreenSharing,
  screenShareAudio,
  screenShareWidth,
  screenShareHeight,
  screenShareError,
  onShareScreen,
  onAudioToggle,
  onWidthChange,
  onHeightChange,

}: MediaControlBarProps) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsMenuAnchor(null);
  };

  const handleModalOpen = (setting: string) => {
    setModalOpen(setting);
    setSettingsMenuAnchor(null);
  };

  const handleModalClose = () => {
    setModalOpen(null);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 2,
          p: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={startGettingMedia}
          startIcon="🎥"
        >
          Start Camera
        </Button>

        <Button
          variant={isScreenSharing ? "contained" : "outlined"}
          color={isScreenSharing ? "error" : "secondary"}
          onClick={onShareScreen}
          startIcon={isScreenSharing ? "⏹️" : "📺"}
        >
          {isScreenSharing ? 'Stop Share' : 'Share Screen'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleSettingsClick}
          startIcon="⚙️"
        >
          Settings
        </Button>
      </Box>
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => handleModalOpen('devices')}>
          🎤 Media Devices
        </MenuItem>
        <MenuItem onClick={() => handleModalOpen('quality')}>
          📹 Video Quality
        </MenuItem>
        <MenuItem onClick={() => handleModalOpen('screen')}>
          🖥️ Screen Share
        </MenuItem>
        <MenuItem onClick={() => handleModalOpen('recording')}>
          🎬 Recording
        </MenuItem>
      </Menu>

      <Modal
        open={modalOpen === 'devices'}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
          <MediaDeviceSettings
            audioInputDevices={audioInputDevices}
            audioOutputDevices={audioOutputDevices}
            videoInputDevices={videoInputDevices}
            selectedAudioDeviceId={selectedAudioDeviceId}
            selectedAudioOutputDeviceId={selectedAudioOutputDeviceId}
            selectedVideoDeviceId={selectedVideoDeviceId}
            switchAudioInput={switchAudioInput}
            switchAudioOutput={switchAudioOutput}
            switchVideoInput={switchVideoInput}
            refreshDevices={refreshDevices}
            startGettingMedia={startGettingMedia}
          />
        </Paper>
      </Modal>
      <Modal
        open={modalOpen === 'screen'}
        onClose={handleModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
          <ScreenShareSettings
            isScreenSharing={isScreenSharing}
            screenShareAudio={screenShareAudio}
            screenShareWidth={screenShareWidth}
            screenShareHeight={screenShareHeight}
            screenShareError={screenShareError}
            onShareScreen={onShareScreen}
            onAudioToggle={onAudioToggle}
            onWidthChange={onWidthChange}
            onHeightChange={onHeightChange}
          />
        </Paper>
      </Modal>

    </>
  );
};

export default MediaControlBar;


//// recordings commented
//<Modal
//  open={modalOpen === 'recording'}
//  onClose={handleModalClose}
//  sx={{
//    display: 'flex',
//    alignItems: 'center',
//    justifyContent: 'center',
//  }}
//>
//  <Paper sx={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
//    <RecordingControls
//      onStartRecording={onStartRecording}
//      onStopRecording={onStopRecording}
//      onPreviewRecordings={onPreviewRecordings}
//    />
//  </Paper>
//</Modal>

// frame rate settings commented
//  <Modal
//  open={modalOpen === 'quality'}
//  onClose={handleModalClose}
//  sx={{
//    display: 'flex',
//    alignItems: 'center',
//    justifyContent: 'center',
//  }}
//>
//  <Paper sx={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
//    <VideoQualitySettings
//      videoRefreshRate={videoRefreshRate}
//      videoFrameRateConstraints={videoFrameRateConstraints}
//      handleFrameRateChange={handleFrameRateChange}
//    />
//  </Paper>
//</Modal>