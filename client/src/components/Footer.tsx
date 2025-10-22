import { Box, Container, Typography, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Typography variant="body2" color="text.secondary">
            &copy; 2024 WebRTC Playground. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with React, TypeScript & Material-UI
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
