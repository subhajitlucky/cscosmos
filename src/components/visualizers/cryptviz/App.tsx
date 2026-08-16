import React from 'react';
import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { TopicPage } from './pages/TopicPage';
import { Playground } from './pages/Playground';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:topicId" element={<TopicPage />} />
          <Route path="playground" element={<Playground />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;