import { BrowserRouter, Routes, Route, useLocation } from '@/components/visualizers/shared/RouterShim';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeProvider';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Learn from './pages/Learn';
import TopicPage from './pages/TopicPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:topicId" element={<TopicPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;