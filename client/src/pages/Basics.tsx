import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useMediaDevices } from '../hooks/useMediaDevices';
import { useScreenShare } from '../hooks/useScreenShare';
import MediaControlBar from '../components/MediaControlBar';
import DraggableVideoPopup from '../components/DraggableVideoPopup';
import DeviceStatus from '../components/DeviceStatus';
import MessageDrawer from '../components/MessageDrawer';
import '../styles/media-video.css';

import 'webrtc-adapter'; // for cross-browser compatibility with WebRTC

import socketClient, { user } from '../socketstuff/socket';

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }
  ]
}

const updateVideoElement = (videoElement: HTMLVideoElement | null, stream: MediaStream | null) => {
  if (!videoElement) {
    console.error('Video element not found');
    return;
  }
  
  videoElement.srcObject = stream;
  if (stream) {
    videoElement.play()
    .catch(err => console.error('Error playing video:', err));
  }
}

const clearStream = (stream: MediaStream | null) => {
  if (!stream) return;

  stream.getTracks().forEach(track => {
    stream.removeTrack(track);
    track.stop();
  });
};

const addTracksToStream = (stream: MediaStream | null, tracks: MediaStreamTrack[]) => {
  if (!stream) return;
  tracks.forEach(track => stream.addTrack(track));
}

type Room = {
  offererUserId: string;
  offer: RTCSessionDescriptionInit;
  offererIceCandidates: RTCIceCandidate[];
  answererUserId: string | null;
  answer: RTCSessionDescriptionInit | null;
  answererIceCandidates: RTCIceCandidate[];
}


const Basics = () => {
  const [screenShareAudio, setScreenShareAudio] = useState(false)
  const [screenShareWidth, setScreenShareWidth] = useState(1000)
  const [screenShareHeight, setScreenShareHeight] = useState(600)

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [isCameraSharing, setIsCameraSharing] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);

  const [rtcOffers, setRTCOffers] = useState<Array<Room>>([]);


  const mainVideoRef = useRef<HTMLVideoElement>(null!);
  const mainStreamRef = useRef<MediaStream | null>(null);

  const cameraVideoRef = useRef<HTMLVideoElement>(null!);
  const secondaryStreamRef = useRef<MediaStream | null>(null);

  const popupStreamRef = useRef<MediaStream | null>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null!);

  const {
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
  } = useMediaDevices(mainVideoRef);

  const {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    error: screenShareError,
  } = useScreenShare();

  const startGettingMedia = useCallback(async (constraints?: MediaStreamConstraints) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined,
        },
        audio: {
          deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined,
        },
        ...(constraints || {})
      });

      

      if (!isScreenSharing) {
        // Camera goes to main stream
        clearStream(mainStreamRef.current);
        clearStream(secondaryStreamRef.current);
        addTracksToStream(mainStreamRef.current, mediaStream.getTracks());
        updateVideoElement(mainVideoRef.current, mainStreamRef.current);
      } else {
        // Camera goes to secondary stream (popup)
        clearStream(secondaryStreamRef.current);
        addTracksToStream(secondaryStreamRef.current, mediaStream.getTracks());
        updateVideoElement(cameraVideoRef.current, secondaryStreamRef.current);
      }
      setIsCameraSharing(true);
    } catch (err) {
      console.log('error startGettingMedia', err)
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId, isScreenSharing])

  const shareScreen = useCallback(async () => {
    if (isScreenSharing) {
      stopScreenShare();
      clearStream(mainStreamRef.current);
      if (isCameraSharing && secondaryStreamRef.current) {
        const mediaTracks = secondaryStreamRef.current.getTracks();
        secondaryStreamRef.current.getTracks().forEach(tr => secondaryStreamRef.current!.removeTrack(tr));
        addTracksToStream(mainStreamRef.current, mediaTracks);
        updateVideoElement(mainVideoRef.current, mainStreamRef.current);
        updateVideoElement(cameraVideoRef.current, null);
      }

      return;
    }

    try {
      const stream = await startScreenShare({
        audio: screenShareAudio,
        video: {
          width: screenShareWidth,
          height: screenShareHeight
        }
      });

      if (stream) {
        // If camera is currently in main stream, move it to secondary
        if (isCameraSharing && mainStreamRef.current) {
          const mediaTracks = mainStreamRef.current.getTracks();
          clearStream(secondaryStreamRef.current);
          clearStream(mainStreamRef.current);
          addTracksToStream(secondaryStreamRef.current, mediaTracks);
          updateVideoElement(cameraVideoRef.current, secondaryStreamRef.current);
        }

        // Add screen share tracks to main stream
        addTracksToStream(mainStreamRef.current, stream.getTracks());
        updateVideoElement(mainVideoRef.current, mainStreamRef.current);
      }
    } catch (err) {
      console.error('Error in shareScreen:', err);
    }
  }, [
    stopScreenShare,
    startScreenShare,
    isScreenSharing,
    isCameraSharing,
    screenShareAudio,
    screenShareWidth,
    screenShareHeight,
  ])

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);

    // Mute/unmute audio tracks in both streams
    if (mainStreamRef.current) {
      mainStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    if (secondaryStreamRef.current) {
      secondaryStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  }, [isMuted]);

  const handleVideoToggle = useCallback(() => {
    setIsVideoOff(!isVideoOff);

    // Enable/disable video tracks in both streams
    if (mainStreamRef.current) {
      mainStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
    }
    if (secondaryStreamRef.current) {
      secondaryStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff]);

  const handleAudioDeviceChange = useCallback((deviceId: string) => {
    switchAudioInput(deviceId);
  }, [switchAudioInput]);

  const handleVideoDeviceChange = useCallback((deviceId: string) => {
    switchVideoInput(deviceId);
  }, [switchVideoInput]);

  const handleToggleMessageDrawer = useCallback(() => {
    setIsMessageDrawerOpen(!isMessageDrawerOpen);
  }, [isMessageDrawerOpen]);

  const startCall = useCallback(async () => {
    // starter peer
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined,
      },
      audio: {
        deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined,
      },
    });

    addTracksToStream(popupStreamRef.current, mediaStream.getTracks());
    updateVideoElement(popupVideoRef.current, popupStreamRef.current);
    setIsVideoPopupOpen(true);

    const peerConnection = new RTCPeerConnection(peerConfiguration);
    popupStreamRef.current!
      .getTracks()
      .forEach(track => peerConnection.addTrack(track, popupStreamRef.current!));

    // setup remote stream
    mainStreamRef.current = new MediaStream();
    updateVideoElement(mainVideoRef.current, mainStreamRef.current);


    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);

    // peer listenings 
    peerConnection.addEventListener("signalingstatechange", (event) => {
      console.log('signalingstatechange', event);
      console.log('signalingstatechange', peerConnection.signalingState)
    });

    peerConnection.addEventListener('icecandidate', e => {
      if (e.candidate) {
        socketClient.emit('cts-ice-candidate', {
          ICECandidate: e.candidate,
          username: user,
          isOfferer: true,
        })
      }
    })

    peerConnection.addEventListener('track', e => {
      e.streams[0].getTracks().forEach(track => {
        mainStreamRef.current!.addTrack(track);
      })
    })

    socketClient.on('stc-ice-candidate', (data) => {
      const {
        ICECandidate,
        username,
        isOfferer,
      } = data;

      if (username === user || isOfferer) return;

      peerConnection.addIceCandidate(ICECandidate);
    });

    socketClient.on('stc-answer-to-offerer', (data) => {
      const { updatedOffer } = data;
      peerConnection.setRemoteDescription(updatedOffer.answer);
    });

    socketClient.emit('cts-new-offer', { offer, user });

  }, [
    selectedVideoDeviceId,
    selectedAudioDeviceId,
  ]);

  const answerCall = useCallback(async (room: Room) => {
    const { offer } = room;

    const peerConnection = new RTCPeerConnection(peerConfiguration);
    peerConnection.setRemoteDescription(offer);

    mainStreamRef.current = new MediaStream();
    updateVideoElement(mainVideoRef.current, mainStreamRef.current);
    peerConnection.addEventListener('track', e => {
      e.streams[0].getTracks().forEach(track => {
        mainStreamRef.current!.addTrack(track);
      })
    })

    peerConnection.addEventListener("signalingstatechange", (event) => {
      console.log('signalingstatechange', event);
      console.log('signalingstatechange', peerConnection.signalingState)
    });

    peerConnection.addEventListener('icecandidate', e => {
      if (e.candidate) {
        socketClient.emit('cts-ice-candidate', {
          ICECandidate: e.candidate,
          username: user,
          isOfferer: false,
        })
      }
    })

    socketClient.on('stc-ice-candidate', (data) => {
      const {
        ICECandidate,
        username,
      } = data;

      if (username === user) return;

      peerConnection.addIceCandidate(ICECandidate);
    });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined,
      },
      audio: {
        deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined,
      },
    });

    mediaStream.getTracks().forEach(track => peerConnection.addTrack(track, mediaStream));

    popupStreamRef.current = new MediaStream();
    addTracksToStream(popupStreamRef.current, mediaStream.getTracks());
    updateVideoElement(popupVideoRef.current, popupStreamRef.current);
    setIsVideoPopupOpen(true);

    const answer = await peerConnection.createAnswer();

    room.answer = answer;
    peerConnection.setLocalDescription(answer);

    const { offererICECandidates } = await socketClient.emitWithAck('cts-answer-offer', { room });

    offererICECandidates.forEach((candidate: RTCIceCandidate) => {
      peerConnection.addIceCandidate(candidate);
    });

  }, [
    selectedAudioDeviceId,
    selectedVideoDeviceId
  ]);

  useEffect(() => {
    return () => {
      clearStream(mainStreamRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearStream(secondaryStreamRef.current);
      clearStream(popupStreamRef.current);
    };
  }, []);

  useEffect(() => {
    socketClient.on('stc-new-offer', (data) => {
      const { offer: { offererUserId } } = data;
      if (offererUserId === user) return;

      const { offer } = data;
      setRTCOffers(prev => {
        return [...prev, offer];
      });
    });


    return () => {
      socketClient.off('stc-new-offer');
    };
  }, []);

  return (
    <Box sx={{
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a'
    }}>
      <Button
        onClick={startCall}
        variant='contained'
        sx={{
          width: '200px',
          position: 'fixed',
          top: 100,
          left: '60px',
          zIndex: 1000
        }}
      >
        Start Call
      </Button>
      <Box
        sx={{
          position: 'fixed',
          top: 100,
          left: '260px',
          zIndex: 1000
        }}
      >
        {
          rtcOffers
            .map((offer) => (
              <Box
                key={offer.offererUserId}
              >
                <Button onClick={() => answerCall(offer)}>Answer Call {offer.offererUserId}</Button>
              </Box>
            ))
        }
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            height: '100%',
            maxHeight: '600px',
            borderRadius: 3,
            backgroundColor: 'black',
            boxShadow: '0 0 10px 0 rgba(242, 242, 242, 0.5)',
            position: 'relative'
          }}
        >
          <video
            ref={mainVideoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
              transform: !isScreenSharing ? 'scaleX(-1)' : 'scaleX(1)' // Mirror camera, not screen share
            }}
            //muted={isScreenSharing} // Only mute for screen share
            muted={true}
          />

          <Box sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(38, 77, 80, 0.7)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '12px'
          }}>
            {isScreenSharing ? 'Screen Share' : 'Camera'}
          </Box>

          <Box sx={{
            position: 'absolute',
            top: -80,
            right: 10,
            backgroundColor: 'rgba(33, 62, 57, 0.8)',
            borderRadius: 1,
            boxShadow: '0 0 10px 0 rgba(71, 40, 40, 0.5)',
            p: 1
          }}>
            <DeviceStatus
              audioInputDevices={audioInputDevices}
              audioOutputDevices={audioOutputDevices}
              videoInputDevices={videoInputDevices}
              selectedAudioDeviceId={selectedAudioDeviceId}
              selectedAudioOutputDeviceId={selectedAudioOutputDeviceId}
              selectedVideoDeviceId={selectedVideoDeviceId}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              onMuteToggle={handleMuteToggle}
              onVideoToggle={handleVideoToggle}
              onAudioDeviceChange={handleAudioDeviceChange}
              onVideoDeviceChange={handleVideoDeviceChange}
            />
          </Box>

          <Tooltip title="Open Messages">
            <IconButton
              onClick={handleToggleMessageDrawer}
              sx={{
                position: 'fixed',
                bottom: 60,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
                zIndex: 10,
              }}
              size="large"
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>

      <MediaControlBar
        // Media Device Settings
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

        // Screen Share Settings
        isScreenSharing={isScreenSharing}
        screenShareAudio={screenShareAudio}
        screenShareWidth={screenShareWidth}
        screenShareHeight={screenShareHeight}
        screenShareError={screenShareError}
        onShareScreen={shareScreen}
        onAudioToggle={setScreenShareAudio}
        onWidthChange={setScreenShareWidth}
        onHeightChange={setScreenShareHeight}
      />

      <DraggableVideoPopup
        videoRef={cameraVideoRef}
        isVisible={isCameraSharing && isScreenSharing}
        onClose={() => (false)}
        title="Camera"
      />
      {
        <DraggableVideoPopup
          videoRef={popupVideoRef}
          isVisible={isVideoPopupOpen}
          onClose={() => setIsVideoPopupOpen(false)}
          title="Remote User"
        />
      }
      <MessageDrawer
        isOpen={isMessageDrawerOpen}
        onClose={() => setIsMessageDrawerOpen(false)}
        currentUser={user}
        room="video-call-room"
      />
    </Box>
  );
};

export default Basics;


// recordings commented
//const recordings = useRef<Blob[]>([]);
//const recorderRef = useRef<MediaRecorder | null>(null);
//const startRecording = useCallback(() => {
//  if (!isScreenSharing) return;

//  const activeStream = mainStreamRef.current;
//  if (activeStream && !recorderRef.current) {
//    recorderRef.current = new MediaRecorder(activeStream);
//  }

//  const recorder = recorderRef.current;
//  if (recorder) {
//    recorder.ondataavailable = e => {
//      recordings.current.push(e.data)
//    }
//    recorder.start();
//  }
//}, [isScreenSharing])


//const stopRecording = useCallback(() => {
//  const recorder = recorderRef.current;

//  recorder?.stop();
//}, [])
//const previewRecordings = useCallback(() => {
//  const previewBlob = new Blob(recordings.current);

//  if (mainVideoRef.current) {
//    mainVideoRef.current.srcObject = null;
//    mainVideoRef.current.src = URL.createObjectURL(previewBlob);
//    mainVideoRef.current.controls = true;
//    mainVideoRef.current.play();
//  }
//}, [])

// frame rate change commented
//const handleFrameRateChage = useCallback(async (_e: unknown, newValue: number) => {
//  setVideoRefreshRate(newValue);

//  try {
//    if (mainStreamRef.current) {
//      const videoTracks = mainStreamRef.current.getVideoTracks();
//      removeTracksFromStream(mainStreamRef, videoTracks);
//    }
//    if (secondaryStreamRef.current) {
//      const videoTracks = secondaryStreamRef.current.getVideoTracks();
//      removeTracksFromStream(secondaryStreamRef, videoTracks);
//    }

//    const newStream = await navigator.mediaDevices.getUserMedia({
//      video: {
//        deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined,
//        frameRate: newValue,
//        aspectRatio: 1,
//        width: 300,
//        height: 300,
//        backgroundBlur: true,
//        sampleRate: 10,
//        displaySurface: '0lklkjjlk;'
//      },
//    });

//    // Add new camera tracks to appropriate stream based on screen share state
//    if (!isScreenSharing) {
//      // Camera goes to main stream
//      addTracksToStream(mainStreamRef, newStream.getTracks());
//      updateVideoElement(mainVideoRef, mainStreamRef.current);
//    } else {
//      // Camera goes to secondary stream (popup)
//      addTracksToStream(secondaryStreamRef, newStream.getTracks());
//      updateVideoElement(cameraVideoRef, secondaryStreamRef.current);
//    }
//  } catch (err) {
//    console.log('error switchVideoInput', err)
//  }
//}, [selectedVideoDeviceId, isScreenSharing, addTracksToStream])

//const [videoRefreshRate, setVideoRefreshRate] = useState(() => {
//  const supportedConstrains = navigator.mediaDevices.getSupportedConstraints();
//  if (supportedConstrains.frameRate) return 30;
//  return 30;
//})
//setVideoFrameRateConstraints(mediaStream.getVideoTracks()[0].getCapabilities().frameRate as unknown as { max: number, min: number })