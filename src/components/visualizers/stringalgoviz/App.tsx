import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Playground } from './pages/Playground';
import { TopicDetail } from './pages/TopicDetail';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/learn" element={<Layout><Learn /></Layout>} />
        <Route path="/learn/:topicId" element={<Layout><TopicDetail /></Layout>} />
        <Route path="/playground" element={<Layout><Playground /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
