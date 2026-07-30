import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import CompilerPage from './features/compiler/CompilerPage';
import ProblemList from './features/problems/ProblemList';
import ProblemSolver from './features/problems/ProblemSolver';
import Home from './features/home/Home';
import ConceptsGrid from './features/concepts/ConceptsGrid';
import TopicPage from './features/concepts/TopicPage';
import About from './features/about/About';
import CheatSheet from './components/tools/CheatSheet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="learn" element={<ConceptsGrid />} />
          <Route path="learn/:topicId" element={<TopicPage />} />

          <Route path="playground" element={<CompilerPage />} />
          <Route path="problems" element={<ProblemList />} />
          <Route path="problems/:id" element={<ProblemSolver />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
