import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { ModulePage } from './pages/ModulePage';
import { ConceptPage } from './pages/ConceptPage';
import { TopicPage } from './pages/TopicPage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/concepts" element={<ConceptPage />} />
                    <Route path="/concepts/:topicId" element={<TopicPage />} />
                    <Route path="/playground" element={<ModulePage />} />
                </Routes>
            </Layout>
        </Router>
    </ThemeProvider>
  );
}

export default App;
