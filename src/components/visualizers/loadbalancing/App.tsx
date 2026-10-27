import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import ConceptDetail from './pages/ConceptDetail';
import Lab from './pages/Lab';

// FS-40: this file's theme effect used to write the <html> class from the
// engine's store, duplicating the shared provider. The effect and the store read
// are gone; src/context/ThemeContext.tsx is the only theme owner.
// NOTE: this file has no importers —
// src/app/loadbalancing/[[...slug]]/EngineMount.tsx imports pages/* directly
// — so nothing here is mounted at runtime. It is left in place (reported, not
// deleted) because removing it is outside the FS-40 scope.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/concepts/:slug" element={<ConceptDetail />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </Router>
  );
}

export default App;