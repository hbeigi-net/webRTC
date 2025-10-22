import { Box, Typography, Avatar, Chip, Paper } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface ParticipantInfoProps {
  localName?: string;
  remoteName?: string;
  isConnected: boolean;
  connectionQuality?: 'good' | 'fair' | 'poor';
  duration?: string;
}

const ParticipantInfo: React.FC<ParticipantInfoProps> = ({
  localName = 'You',
  remoteName = 'Guest',
  isConnected,
  connectionQuality = 'good',
  duration = '00:00',
}) => {
  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'good':
        return 'success.main';
      case 'fair':
        return 'warning.main';
      case 'poor':
        return 'error.main';
      default:
        return 'success.main';
    }
  };

  const getConnectionLabel = () => {
    if (!isConnected) return 'Connecting...';
    switch (connectionQuality) {
      case 'good':
        return 'Connected';
      case 'fair':
        return 'Fair Connection';
      case 'poor':
        return 'Poor Connection';
      default:
        return 'Connected';
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        backgroundColor: 'background.paper',
        padding: 2,
        borderRadius: 2,
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Participants */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'primary.main',
                fontSize: '1rem',
              }}
            >
              {localName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {localName}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary">
            ⟷
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: isConnected ? 'secondary.main' : 'grey.500',
                fontSize: '1rem',
              }}
            >
              {remoteName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {remoteName}
            </Typography>
          </Box>
        </Box>

        {/* Connection Status and Duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={
              <FiberManualRecord
                sx={{
                  fontSize: '0.8rem',
                  color: isConnected ? getConnectionColor() : 'grey.500',
                }}
              />
            }
            label={getConnectionLabel()}
            size="small"
            sx={{
              backgroundColor: isConnected
                ? 'rgba(76, 175, 80, 0.1)'
                : 'rgba(158, 158, 158, 0.1)',
              fontWeight: 500,
            }}
          />
          {isConnected && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {duration}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ParticipantInfo;

