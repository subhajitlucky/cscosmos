import { BrowserRouter, Routes, Route } from '@/components/visualizers/shared/RouterShim'
import { ThemeProvider } from "./lib/theme"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Learn } from "./pages/Learn"
import { TopicPage } from "./pages/TopicPage"
import { Playground } from "./pages/Playground"
import { About } from "./pages/About"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="solidityviz-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:topicId" element={<TopicPage />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
