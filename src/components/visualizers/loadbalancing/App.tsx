import React from 'react';
import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import ConceptDetail from './pages/ConceptDetail';
import Lab from './pages/Lab';
import { useStore } from './store/useStore';

function App() {
  const theme = useStore(state => state.theme);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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