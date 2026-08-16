import React from 'react';
import { BrowserRouter, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from './context/ThemeProvider';
import AppLayout from './components/layout/AppLayout';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const LearningPath = React.lazy(() => import('./pages/LearningPath'));
const Playground = React.lazy(() => import('./pages/Playground'));
const TopicDetail = React.lazy(() => import('./pages/TopicDetail'));

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/learn">
                <Route index element={<LearningPath />} />
                <Route path=":topicId" element={<TopicDetail />} />
              </Route>
              
              <Route path="/playground" element={<Playground />} />
            </Routes>
          </React.Suspense>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;