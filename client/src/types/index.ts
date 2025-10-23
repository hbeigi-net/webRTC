// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface WebRTCConnection {
  id: string;
  peerConnection: RTCPeerConnection;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  isConnected: boolean;
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
}

export interface MediaConstraints {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

// Navigation types
export type RoutePath = '/' | '/about' | '/contact';

// Component prop types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface PageProps {
  className?: string;
}

// Message types for chat functionality
export interface ChatMessage {
  id: string;
  message: string;
  user: string;
  timestamp: number;
  isOwn: boolean;
}

export interface MessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string;
}