import { useCallback, useRef, useState } from 'react';

interface ScreenShareOptions {
  audio?: boolean;
  video?: {
    width?: number;
    height?: number;
  };
}

interface ScreenShareHook {
  startScreenShare: (options?: ScreenShareOptions) => Promise<MediaStream | null>;
  stopScreenShare: () => void;
  isScreenSharing: boolean;
  screenStream: React.MutableRefObject<MediaStream | null>;
  error: string | null;
}

export const useScreenShare = (): ScreenShareHook => {
  const screenStream = useRef<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScreenShare = useCallback(async (options?: ScreenShareOptions): Promise<MediaStream | null> => {
    try {
      setError(null);
      
      const displayMediaOptions: DisplayMediaStreamOptions = {
        audio: options?.audio ?? false,
        video: {
          width: options?.video?.width ?? 1000,
          height: options?.video?.height ?? 600
        },
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      screenStream.current = stream;
      setIsScreenSharing(true);

      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        screenStream.current = null;
        setIsScreenSharing(false);
      };

      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start screen sharing';
      setError(errorMessage);
      console.log('Error starting screen share:', err);
      return null;
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => {
        track.stop();
      });
      screenStream.current = null;
      setIsScreenSharing(false);
    }
  }, []);

  return {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    screenStream,
    error,
  };
};
