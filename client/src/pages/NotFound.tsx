import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '6rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default NotFound;
