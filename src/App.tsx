import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { DomainPage } from './pages/DomainPage';
import { About } from './pages/About';
import { ComingSoon } from './pages/ComingSoon';
import { AllTopics } from './pages/AllTopics';
import { TopicDetail } from './pages/TopicDetail';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cscosmos-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<AllTopics />} />
          <Route path="/about" element={<About />} />
          <Route path="/coming-soon" element={<ComingSoon />} />

          {/* Topic details before domain route for better specificity */}
          <Route path="/:domainKey/:topicSlug" element={<TopicDetail />} />

          {/* Dynamic Route for Domains */}
          <Route path="/:domainKey" element={<DomainPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
