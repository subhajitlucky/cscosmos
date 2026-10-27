import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { HomePage } from './pages/HomePage';
import { ConceptMapPage } from './pages/ConceptMapPage';
import { ConceptPage } from './pages/ConceptPage';
import { LabPage } from './pages/LabPage';

// FS-40: this engine's private ThemeProvider (a second writer of the <html>
// class) was deleted; the shared provider in src/context/ThemeContext.tsx is the
// only theme owner. NOTE: this file has no importers — src/app/k8scosmos/[[...slug]]/
// EngineMount.tsx imports pages/* directly — so nothing here is mounted at
// runtime. It is left in place (reported, not deleted) because removing it is
// outside the FS-40 scope.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/concepts" element={<ConceptMapPage />} />
        <Route path="/concepts/:conceptId" element={<ConceptPage />} />
        <Route path="/lab" element={<LabPage />} />
      </Routes>
    </Router>
  );
}

export default App;
