import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MuiThemeProviderWrapper } from './theme/ThemeProvider';
import Layout from './components/Layout';
import Basics from './pages/Basics';

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProviderWrapper>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Basics />} />
            </Routes>
          </Layout>
        </Router>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  );
}

export default App;