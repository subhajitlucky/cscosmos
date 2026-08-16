import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { ConceptMapPage } from './pages/ConceptMapPage';
import { ConceptPage } from './pages/ConceptPage';
import { LabPage } from './pages/LabPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/concepts" element={<ConceptMapPage />} />
          <Route path="/concepts/:conceptId" element={<ConceptPage />} />
          <Route path="/lab" element={<LabPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
