import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
} from '@mui/material';
import {
  Videocam,
  Mic,
  Security,
  Speed,
  Group,
  CloudSync,
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <Videocam sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Communication',
      description: 'Experience seamless peer-to-peer connections with WebRTC',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Video & Audio',
      description: 'High-quality video and audio streaming capabilities',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Data Channels',
      description: 'Secure data transfer between peers',
    },
    {
      icon: <Group sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Multi-user Support',
      description: 'Connect multiple participants in real-time',
    },
    {
      icon: <CloudSync sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cross-platform',
      description: 'Works across all modern browsers and devices',
    },
    {
      icon: <Mic sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Audio Processing',
      description: 'Advanced audio processing and noise cancellation',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" component="h1" fontWeight="bold">
              Welcome to WebRTC Playground
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600 }}>
              Explore real-time communication with WebRTC technology
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                to="/about"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Learn More
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{
              xs: 12,
              sm: 6,
              md: 4,
            }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
