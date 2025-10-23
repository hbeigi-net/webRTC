import { useRef, useEffect, useState, useCallback } from 'react';

interface MediaDevicesHook {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];

  selectedAudioDeviceId: string;
  selectedAudioOutputDeviceId: string;
  selectedVideoDeviceId: string;

  switchAudioInput: (deviceId: string) => Promise<void>;
  switchAudioOutput: (deviceId: string) => Promise<void>;
  switchVideoInput: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
  startMedia: (constraints?: MediaStreamConstraints) => Promise<void>;
  stopMedia: () => void;
  addStreamToVideo: (stream: MediaStream) => void;

  getCurrentTracks: () => { audio: MediaStreamTrack | null; video: MediaStreamTrack | null; all: MediaStreamTrack[] };
  hasTrackOfKind: (kind: 'audio' | 'video') => boolean;

  stream: MediaStream;
}

type MediaDeviceType =  
| 'audioinput'
| 'videoinput'
| 'audiooutput';

const keyMap: Record<MediaDeviceType, string> = {
  audioinput: 'preferredAudioDevice',
  videoinput: 'preferredVideoDevice',
  audiooutput: 'preferredAudioOutputDevice',
}

const getPreferenceKey = (deviceType: MediaDeviceType): string => {
  if (!deviceType) throw new Error('Device type is required');

  return keyMap[deviceType];
}

const getSavedDevicePreference = (deviceType: MediaDeviceType): string | null => {
  return localStorage.getItem(getPreferenceKey(deviceType));
}

const saveDevicePreference = (deviceType: MediaDeviceType, deviceId: string) => {
  localStorage.setItem(getPreferenceKey(deviceType), deviceId);
}

export const useMediaDevices = (videoElementRef: React.RefObject<HTMLVideoElement>): MediaDevicesHook => {
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState('');
  const [selectedAudioOutputDeviceId, setSelectedAudioOutputDeviceId] = useState('');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');

  const streamRef = useRef<MediaStream>(new MediaStream());

  const getTrackByKind = useCallback((kind: 'audio' | 'video'): MediaStreamTrack | null => {
    const tracks = streamRef.current.getTracks();
    return tracks.find(track => track.kind === kind) || null;
  }, []);

  const removeTracksByKind = useCallback((kind: 'audio' | 'video') => {
    const tracks = streamRef.current.getTracks();
    tracks.forEach(track => {
      if (track.kind === kind) {
        track.stop();
        streamRef.current.removeTrack(track);
      }
    });
  }, []);

  const addTrackToStream = useCallback((track: MediaStreamTrack) => {
    streamRef.current.addTrack(track);
  }, []);

  const getCurrentTracks = useCallback(() => {
    return {
      audio: getTrackByKind('audio'),
      video: getTrackByKind('video'),
      all: streamRef.current.getTracks()
    };
  }, [getTrackByKind]);

  const hasTrackOfKind = useCallback((kind: 'audio' | 'video'): boolean => {
    return getTrackByKind(kind) !== null;
  }, [getTrackByKind]);

  const getAvailableMediaDevices = useCallback(async () => {
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices;
  }, []);

  const updateMediaDevices = useCallback(async () => {
    const devices = await getAvailableMediaDevices();
    
    setMediaDevices(devices);
  }, [getAvailableMediaDevices]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      console.log("Device change detected");
      await updateMediaDevices();
    });

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', () => { });
    };
  }, [updateMediaDevices]);

  const validateDeviceCapabilities = useCallback(async (deviceId: string, kind: string): Promise<boolean> => {
    try {
      const constraints = kind === 'audioinput'
        ? { audio: { deviceId: { exact: deviceId } } }
        : kind === 'videoinput'
          ? { video: { deviceId: { exact: deviceId } } }
          : { audio: { deviceId: { exact: deviceId } } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }, []);

  const selectBestDevice = useCallback(async (devices: MediaDeviceInfo[], kind: MediaDeviceType, setter: (id: string) => void) => {
    if (devices.length === 0) {
      console.warn(`No ${kind} devices found`);
      return;
    }

    // Priority order: saved preference -> default device -> first available
    const savedPreference = getSavedDevicePreference(kind);
    let selectedDevice: MediaDeviceInfo | undefined;

    // Try saved preference
    if (savedPreference) {
      selectedDevice = devices.find(dvc => dvc.deviceId === savedPreference);
      if (selectedDevice) {
        const isValid = await validateDeviceCapabilities(selectedDevice.deviceId, kind);
        if (isValid) {
          setter(selectedDevice.deviceId);
          return;
        } else {
          console.warn(`Saved ${kind} device is no longer available, falling back to default`);
        }
      }
    }

    // Try default device
    selectedDevice = devices.find(dvc => dvc.deviceId === 'default');
    if (selectedDevice) {
      const isValid = await validateDeviceCapabilities(selectedDevice.deviceId, kind);
      if (isValid) {
        setter(selectedDevice.deviceId);
        return;
      }
    }

    // 3. Fallback to first available device
    for (const device of devices) {
      const isValid = await validateDeviceCapabilities(device.deviceId, kind);
      if (isValid) {
        setter(device.deviceId);
        return;
      }
    }

    throw new Error(`No working ${kind} devices found`);
  }, [validateDeviceCapabilities]);

  const initializeDevices = useCallback(async () => {
    try {
      const devices = await getAvailableMediaDevices();
      
      const audioInputDevices = devices.filter(dvc => dvc.kind === 'audioinput');
      await selectBestDevice(audioInputDevices, 'audioinput', setSelectedAudioDeviceId);

      const audioOutputDevices = devices.filter(dvc => dvc.kind === 'audiooutput');
      await selectBestDevice(audioOutputDevices, 'audiooutput', setSelectedAudioOutputDeviceId);

      const videoInputDevices = devices.filter(dvc => dvc.kind === 'videoinput');
      await selectBestDevice(videoInputDevices, 'videoinput', setSelectedVideoDeviceId);

      setMediaDevices(devices);
    } catch (err) {
      console.error('Error initializing media devices:', err);
    }
  }, [getAvailableMediaDevices, selectBestDevice]);

  const addStreamToVideo = useCallback((stream: MediaStream) => {
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = stream;
      videoElementRef.current.className = 'media-video'; // CSS class instead of inline styles
      videoElementRef.current.setSinkId(selectedAudioOutputDeviceId);
      videoElementRef.current.play();
    }
  }, [selectedAudioOutputDeviceId, videoElementRef]);

  const startMedia = useCallback(async (constraints?: MediaStreamConstraints) => {
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

      // Stop any existing tracks
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = new MediaStream();

      // Add tracks by kind instead of by index
      const videoTrack = mediaStream.getVideoTracks().find(track => track.kind === 'video');
      const audioTrack = mediaStream.getAudioTracks().find(track => track.kind === 'audio');

      if (videoTrack) {
        addTrackToStream(videoTrack);
      }
      if (audioTrack) {
        addTrackToStream(audioTrack);
      }

      addStreamToVideo(streamRef.current);
    } catch (err) {
      console.log('Error starting media:', err);
    }
  }, [selectedAudioDeviceId, selectedVideoDeviceId, addStreamToVideo, addTrackToStream]);

  const stopMedia = useCallback(() => {
    streamRef.current.getTracks().forEach(track => {
      track.stop();
    });
    streamRef.current = new MediaStream();

    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
  }, [videoElementRef]);

  const switchAudioInput = useCallback(async (deviceId: string) => {
    if (deviceId) {
      try {
        removeTracksByKind('audio');

        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });

        const audioTrack = newStream.getAudioTracks().find(track => track.kind === 'audio');
        if (audioTrack) {
          addTrackToStream(audioTrack);
        }

        setSelectedAudioDeviceId(deviceId);
        saveDevicePreference('audioinput', deviceId);
      } catch (err) {
        console.error('Error switching audio input:', err);
      }
    }
  }, [removeTracksByKind, addTrackToStream]);

  const switchAudioOutput = useCallback(async (deviceId: string) => {
    if (deviceId && videoElementRef.current) {
      try {
        videoElementRef.current.setSinkId(deviceId);
        setSelectedAudioOutputDeviceId(deviceId);
        saveDevicePreference('audiooutput', deviceId);
      } catch (err) {
        console.error('Error switching audio output:', err);
      }
    }
  }, [videoElementRef]);

  const switchVideoInput = useCallback(async (deviceId: string) => {
    if (deviceId) {
      try {
        removeTracksByKind('video');

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
        });

        const videoTrack = newStream.getVideoTracks().find(track => track.kind === 'video');
        if (videoTrack) {
          addTrackToStream(videoTrack);
        }

        setSelectedVideoDeviceId(deviceId);
        saveDevicePreference('videoinput', deviceId);
      } catch (err) {
        console.error('Error switching video input:', err);
      }
    }
  }, [removeTracksByKind, addTrackToStream]);

  const refreshDevices = useCallback(async () => {
    await updateMediaDevices();
  }, [updateMediaDevices]);

  useEffect(() => {
    initializeDevices();
  }, [initializeDevices]);

  const audioInputDevices = mediaDevices.filter(device => device.kind === 'audioinput');
  const audioOutputDevices = mediaDevices.filter(device => device.kind === 'audiooutput');
  const videoInputDevices = mediaDevices.filter(device => device.kind === 'videoinput');

  return {
    // Device lists
    audioInputDevices,
    audioOutputDevices,
    videoInputDevices,

    // Selected devices
    selectedAudioDeviceId,
    selectedAudioOutputDeviceId,
    selectedVideoDeviceId,

    // Methods
    switchAudioInput,
    switchAudioOutput,
    switchVideoInput,
    refreshDevices,
    startMedia,
    stopMedia,
    addStreamToVideo,

    // Track management utilities
    getCurrentTracks,
    hasTrackOfKind,

    stream: streamRef.current,
  };
};
