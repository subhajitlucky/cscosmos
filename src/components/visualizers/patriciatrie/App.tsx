import { BrowserRouter as Router, Routes, Route, useLocation } from '@/components/visualizers/shared/RouterShim';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Playground from './pages/Playground';
import Layout from './components/layout/Layout';
import TopicPage from './pages/TopicPage';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/layout/ScrollToTop';
import { ThemeProvider } from './hooks/useTheme';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/learn" element={<PageWrapper><Learn /></PageWrapper>} />
        <Route path="/learn/:topicId" element={<PageWrapper><TopicPage /></PageWrapper>} />
        <Route path="/playground" element={<PageWrapper><Playground /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;