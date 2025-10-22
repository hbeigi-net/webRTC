import {
  Container,
  Box,
  Button,
  Select,
  Grid,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  Slider,
  Typography,
} from '@mui/material';
import { useRef, useEffect, useState, useCallback, type ChangeEvent } from 'react';

type SelectInputChangeEvent = ChangeEvent<Omit<HTMLInputElement, "value"> & { value: string; }> | (Event & { target: { value: string; name: string; }; });

const Basics = () => {
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState('');
  const [selectedAudioOutputDeviceId, setSelectedAudioOutputDeviceId] = useState('');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');

  const [videoFrameRateConstraints, setVideoFrameRateConstraints] = useState({ min: 0, max: 30 })
  const [videoRefreshRate, setVideoRefreshRate] = useState(() => {
    const supportedConstrains = navigator.mediaDevices.getSupportedConstraints();
    if (supportedConstrains.frameRate) return 30
  })

  const streamRef = useRef<MediaStream>(new MediaStream());
  const videoElemRef = useRef<HTMLVideoElement>(null);
  const recordings = useRef<Blob[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const updateMediaDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setMediaDevices(devices);

    return devices
  }, [])

  const catchMediaDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      navigator.mediaDevices.addEventListener('devicechange', async () => {
        console.log("device change")
        await updateMediaDevices();
      });

      const devices = await updateMediaDevices();

      const firstAudioInputDevice = devices.find(dvc => dvc.kind === 'audioinput');
      if (firstAudioInputDevice) {
        setSelectedAudioDeviceId(firstAudioInputDevice.deviceId);
      }

      const firstAudioOutputDevice = devices.find(dvc => dvc.kind === 'audiooutput');
      if (firstAudioOutputDevice) {
        setSelectedAudioOutputDeviceId(firstAudioOutputDevice.deviceId);
      }

      const firstVideoDevice = devices.find(dvc => dvc.kind === 'videoinput');
      if (firstVideoDevice) {
        setSelectedVideoDeviceId(firstVideoDevice.deviceId);
      }

    } catch (err) {
      console.log('error catchMediaDevices', err)
    }
  }, [updateMediaDevices])

  const startGettingMedia = useCallback(async (constraints?: MediaStreamConstraints) => {
    try {
      const coreStream = new MediaStream();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedVideoDeviceId },
        },
        audio: {
          deviceId: { exact: selectedAudioDeviceId },
        },
        ...constraints || {}
      });

      console.log("laksdjf;kl", mediaStream.getVideoTracks()[0].getCapabilities().frameRate)
      setVideoFrameRateConstraints(mediaStream.getVideoTracks()[0].getCapabilities().frameRate as unknown as { max: number, min: number })
      coreStream.addTrack(mediaStream.getVideoTracks()[0]);
      coreStream.addTrack(mediaStream.getAudioTracks()[0]);

      streamRef.current = coreStream;
      videoElemRef.current!.srcObject = coreStream;

      videoElemRef.current!.style.transform = 'scaleX(-1)';
      videoElemRef.current!.style.width = '100%';
      videoElemRef.current!.style.height = '100%';
      videoElemRef.current!.style.objectFit = 'cover';

      videoElemRef.current!.setSinkId(selectedAudioOutputDeviceId);
      videoElemRef.current!.play();
    } catch (err) {
      console.log('error startGettingMedia', err)
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId, selectedAudioOutputDeviceId])

  const switchVoiceOutput = useCallback(async (event: SelectInputChangeEvent) => {
    const deviceId = event.target.value as string;
    if (deviceId) {
      try {
        videoElemRef.current!.setSinkId(deviceId);
        setSelectedAudioOutputDeviceId(deviceId);
      } catch (err) {
        console.log('error switchVoiceOutput', err)
      }
    }
  }, [])

  const switchVoiceInput = useCallback(async (event: SelectInputChangeEvent) => {
    const deviceId = event.target.value as string;
    if (deviceId) {
      try {
        streamRef.current.getAudioTracks().forEach(track => {
          track.stop();
          streamRef.current.removeTrack(track);
        });

        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });

        streamRef.current.addTrack(newStream.getAudioTracks()[0]);
        setSelectedAudioDeviceId(deviceId);
      } catch (err) {
        console.log('error switchVoiceInput', err)
      }
    }
  }, [])

  const switchVideoInput = useCallback(async (event: SelectInputChangeEvent) => {
    const deviceId = event.target.value as string;
    if (deviceId) {
      try {
        streamRef.current.getVideoTracks().forEach(track => {
          track.stop()
          streamRef.current.removeTrack(track);
        });

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
        });

        streamRef.current.addTrack(newStream.getVideoTracks()[0]);
        setSelectedVideoDeviceId(deviceId);
      } catch (err) {
        console.log('error switchVideoInput', err)
      }
    }
  }, [])

  const handleFrameRateChage = useCallback(async (_e: unknown, newValue: number) => {
    setVideoRefreshRate(newValue);
    console.log('new value', newValue);

    try {
      streamRef.current.getVideoTracks().forEach(track => {
        track.stop()
        streamRef.current.removeTrack(track);
      });

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedVideoDeviceId },
          frameRate: newValue,
          aspectRatio: 1,
          width: 300,
          height: 300,
          backgroundBlur: true,
          sampleRate: 10,
          displaySurface: '0lklkjjlk;'
        },
      });

      streamRef.current.addTrack(newStream.getVideoTracks()[0]);
    } catch (err) {
      console.log('error switchVideoInput', err)
    }
  }, [selectedVideoDeviceId])

  const shareScreen = useCallback(async () => {
    const displayMediaOptions: DisplayMediaStreamOptions = {
      audio: false,
      video: {
        width: 1000,
        height: 600
      },
    };

    const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    streamRef.current.getTracks()
      .forEach(tr => {
        tr.stop();
        streamRef.current.removeTrack(tr)
      })
    videoElemRef.current!.style.transform = 'scaleX(1)'
    streamRef.current.addTrack(screenStream.getVideoTracks()[0]);
  }, [])

  const startRecording = useCallback(() => {
    if (!recorderRef.current) recorderRef.current = new MediaRecorder(streamRef.current)

    const recorder = recorderRef.current;

    recorder.ondataavailable = e => {
      recordings.current.push(e.data)
    }

    recorder.start();
  }, [])

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;

    recorder?.stop();

  }, [])

  const previewRecordings = useCallback(() => {
    const previewBlob = new Blob(recordings.current);
    console.log('previewBlog', previewBlob);
    
    videoElemRef!.current!.srcObject = null;
    videoElemRef.current!.src = URL.createObjectURL(previewBlob);
    videoElemRef.current!.controls = true
    videoElemRef.current?.play()
  }, [])
  useEffect(() => {

    catchMediaDevices();
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', () => { });
    };
  }, [catchMediaDevices])

  const audioInputDevices = mediaDevices.filter(device => device.kind === 'audioinput');
  const audioOutputDevices = mediaDevices.filter(device => device.kind === 'audiooutput');
  const videoInputDevices = mediaDevices.filter(device => device.kind === 'videoinput');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {audioInputDevices.length > 0 && (
          <Grid size={{
            xs: 12,
            md: 4,
          }}>
            <FormControl sx={{ width: '100%', mt: 3 }}>
              <InputLabel id="audio-input-device-label">Audio Input Device</InputLabel>
              <Select
                id='audio-input-device-label'
                labelId="audio-input-device-label"
                displayEmpty
                value={selectedAudioDeviceId}
                onChange={switchVoiceInput}
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
          <Grid size={{
            xs: 12,
            md: 4,
          }}>
            <FormControl sx={{ width: '100%', mt: 3 }}>
              <InputLabel id="audio-output-device-label">Audio Output Device</InputLabel>
              <Select
                displayEmpty
                id='audio-output-device-label'
                labelId="audio-output-device-label"
                value={selectedAudioOutputDeviceId}
                onChange={switchVoiceOutput}
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
          <Grid size={{
            xs: 12,
            md: 4,
          }}>
            <FormControl sx={{ width: '100%', mt: 3 }}>
              <InputLabel id="video-input-device-label">Video Input Device</InputLabel>
              <Select
                displayEmpty
                id='video-input-device-label'
                labelId="video-input-device-label"
                value={selectedVideoDeviceId}
                onChange={switchVideoInput}
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
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Slider
            value={videoRefreshRate}
            onChange={handleFrameRateChage}
            min={videoFrameRateConstraints.min}
            max={videoFrameRateConstraints.max}
            step={5}
            valueLabelDisplay="auto"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Min: {videoFrameRateConstraints.min}</Typography>
            <Typography variant="body2">Max: {videoFrameRateConstraints.max}</Typography>
          </Box>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={shareScreen}
          >
            share screen
          </Button>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={startRecording}
          >
            start recording
          </Button>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={stopRecording}
          >
            stop recording
          </Button>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={previewRecordings}
          >
            Play recording
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => startGettingMedia()}
        >
          Start Getting Media
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={catchMediaDevices}
        >
          Refresh Devices
        </Button>
      </Box>

      <Box
        component="div"
        sx={{
          margin: '0 auto',
          mt: 3,
          width: '60vw',
          height: '70vh',
        }}
      >
        <video ref={videoElemRef} />
      </Box>
    </Container>
  );
};

export default Basics;