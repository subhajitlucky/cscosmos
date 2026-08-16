import React from 'react';
import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import TopicPage from './pages/TopicPage';
import Playground from './pages/Playground';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-evm-bg text-neutral-900 dark:text-neutral-200 selection:bg-evm-accent/30 flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-6 md:px-12 lg:px-20 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:topicId" element={<TopicPage />} />
              <Route path="/playground" element={<Playground />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;