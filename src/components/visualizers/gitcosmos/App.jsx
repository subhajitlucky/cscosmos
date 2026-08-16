import { Routes, Route } from '@/components/visualizers/shared/RouterShim'
import Layout from './components/Layout'
import Home from './pages/Home'
import ConceptMap from './pages/ConceptMap'
import ConceptPage from './pages/ConceptPage'
import Playground from './pages/Playground'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="concepts" element={<ConceptMap />} />
        <Route path="concepts/:id" element={<ConceptPage />} />
        <Route path="playground" element={<Playground />} />
      </Route>
    </Routes>
  )
}

export default App