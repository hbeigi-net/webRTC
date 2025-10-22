import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Email,
  GitHub,
  Send,
  ContactMail,
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Email color="primary" />,
      title: 'Email',
      value: 'contact@webrtcplayground.com',
    },
    {
      icon: <GitHub color="primary" />,
      title: 'GitHub',
      value: 'github.com/webrtc-playground',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Contact Us
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Get in Touch
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Have questions about WebRTC or want to contribute to this project? 
                    We'd love to hear from you!
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  {contactInfo.map((info, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {info.icon}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {info.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {info.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Send us a Message
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Send Message
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you for your message! (This is a demo)
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
