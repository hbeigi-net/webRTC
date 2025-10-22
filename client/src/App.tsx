import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MuiThemeProviderWrapper } from './theme/ThemeProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Basics from './pages/Basics';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProviderWrapper>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/basics" element={<Basics />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  );
}

export default App;