import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { MessageDrawerProps, ChatMessage } from '../types';

const MessageDrawer: React.FC<MessageDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  currentUser,
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (user: string) => {
    return user
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'background.default',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon />
            <Typography variant="h6" component="h2">
              Messages
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: 'primary.contrastText' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages List */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 1,
            backgroundColor: 'background.paper',
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
                textAlign: 'center',
                p: 3,
              }}
            >
              <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body2">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: message.isOwn ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    mb: 1,
                    px: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.75rem',
                      mr: message.isOwn ? 0 : 1,
                      ml: message.isOwn ? 1 : 0,
                      backgroundColor: message.isOwn
                        ? 'primary.main'
                        : 'secondary.main',
                    }}
                  >
                    {getInitials(message.user)}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      backgroundColor: message.isOwn
                        ? 'primary.main'
                        : 'grey.100',
                      color: message.isOwn
                        ? 'primary.contrastText'
                        : 'text.primary',
                      borderRadius: 2,
                      borderRadiusTopLeft: message.isOwn ? 2 : 0.5,
                      borderRadiusTopRight: message.isOwn ? 0.5 : 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: message.isOwn ? 500 : 400,
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Divider />

        {/* Message Input */}
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    color="primary"
                    size="small"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MessageDrawer;
