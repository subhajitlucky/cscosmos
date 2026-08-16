import { BrowserRouter as Router, Routes, Route } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from '@/components/visualizers/cloudcosmos/components/theme-provider';
import { Layout } from '@/components/visualizers/cloudcosmos/components/layout/Layout';
import { HomePage } from '@/components/visualizers/cloudcosmos/pages/HomePage';
import { ConceptMapPage } from '@/components/visualizers/cloudcosmos/pages/ConceptMapPage';
import { ConceptDetailPage } from '@/components/visualizers/cloudcosmos/pages/ConceptDetailPage';
import { CloudLabPage } from '@/components/visualizers/cloudcosmos/pages/CloudLabPage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cloudcosmos-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/concepts" element={<ConceptMapPage />} />
            <Route path="/concepts/:id" element={<ConceptDetailPage />} />
            <Route path="/lab" element={<CloudLabPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;