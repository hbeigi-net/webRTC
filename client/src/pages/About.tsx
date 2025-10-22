import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import {
  Code,
  Router,
  Videocam,
  Palette,
  School,
  Security,
  Speed,
} from '@mui/icons-material';

const About = () => {
  const technologies = [
    { name: 'React 19', icon: <Code />, color: 'primary' },
    { name: 'TypeScript', icon: <Code />, color: 'info' },
    { name: 'React Router', icon: <Router />, color: 'secondary' },
    { name: 'Material-UI', icon: <Palette />, color: 'success' },
    { name: 'WebRTC APIs', icon: <Videocam />, color: 'warning' },
  ];

  const features = [
    'Peer-to-peer communication',
    'Video and audio streaming',
    'Real-time data transfer',
    'Cross-platform compatibility',
    'Secure connections',
    'Low latency performance',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        About WebRTC Playground
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          WebRTC Playground is a demonstration project showcasing the power of 
          Web Real-Time Communication (WebRTC) technology. This project provides 
          a hands-on environment for exploring peer-to-peer communication, 
          video/audio streaming, and real-time data transfer.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                What is WebRTC?
              </Typography>
              <Typography variant="body1" paragraph>
                WebRTC is a free, open-source project that provides web browsers and 
                mobile applications with real-time communication (RTC) capabilities via 
                simple APIs. It allows for peer-to-peer audio, video, and data sharing 
                without plugins.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Key Features
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Key Technologies
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {technologies.map((tech, index) => (
            <Chip
              key={index}
              icon={tech.icon}
              label={tech.name}
              color={tech.color as any}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Project Goals
          </Typography>
          <Typography variant="body1" paragraph>
            This playground aims to provide a comprehensive learning environment 
            for developers interested in implementing real-time communication 
            features in their applications. Whether you're building video conferencing 
            apps, live streaming platforms, or collaborative tools, this project 
            demonstrates the core concepts and best practices.
          </Typography>
          <Typography variant="body1">
            The project serves as both a learning resource and a foundation for 
            building production-ready WebRTC applications with modern React patterns 
            and Material-UI components.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About;
