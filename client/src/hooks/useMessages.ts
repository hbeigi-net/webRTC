import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';
import socketClient from '../socketstuff/socket';

interface UseMessagesProps {
  currentUser: string;
  room?: string;
}

export const useMessages = ({ currentUser, room = 'default' }: UseMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const generateMessageId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = useCallback((messageText: string) => {
    if (!isConnected || !messageText.trim()) return;

    const message: ChatMessage = {
      id: generateMessageId(),
      message: messageText,
      user: currentUser,
      timestamp: Date.now(),
      isOwn: true,
    };

    setMessages(prev => [...prev, message]);

    socketClient.emit('cts-message', {
      message: messageText,
      user: currentUser,
    });
  }, [currentUser, isConnected]);

  const joinRoom = useCallback((roomName: string) => {
    if (isConnected) {
      socketClient.emit('joinRoom', {
        room: roomName,
        user: currentUser,
      });
    }
  }, [currentUser, isConnected]);

  const leaveRoom = useCallback((roomName: string) => {
    if (isConnected) {
      socketClient.emit('leaveRoom', {
        room: roomName,
        user: currentUser,
      });
    }
  }, [currentUser, isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
      if (room) {
        joinRoom(room);
      }
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleMessage = (data: { message: string; user: string; timestamp: number }) => {
      if (data.user === currentUser) return;

      const message: ChatMessage = {
        id: generateMessageId(),
        message: data.message,
        user: data.user,
        timestamp: data.timestamp,
        isOwn: false,
      };

      setMessages(prev => [...prev, message]);
    };

    const handleUserJoined = (data: { user: string; timestamp: number }) => {
      const systemMessage: ChatMessage = {
        id: generateMessageId(),
        message: `${data.user} joined the call`,
        user: 'System',
        timestamp: data.timestamp,
        isOwn: false,
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    const handleUserLeft = (data: { user: string; timestamp: number }) => {
      const systemMessage: ChatMessage = {
        id: generateMessageId(),
        message: `${data.user} left the call`,
        user: 'System',
        timestamp: data.timestamp,
        isOwn: false,
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);
    socketClient.on('message', handleMessage);
    socketClient.on('userJoined', handleUserJoined);
    socketClient.on('userLeft', handleUserLeft);
    socketClient.on('error', err => {
      alert("error: " + err)
    })
    if (!socketClient.connected) {
      socketClient.connect();
    }

    return () => {
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
      socketClient.off('message', handleMessage);
      socketClient.off('userJoined', handleUserJoined);
      socketClient.off('userLeft', handleUserLeft);;
    };
  }, [currentUser, room, joinRoom]);

  return {
    messages,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    clearMessages,
  };
};
