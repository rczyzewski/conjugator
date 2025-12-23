import './App.css';
import VerbQuiz from './pages/conjugacion/VerbQuiz';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/conjugacion/ConjugacionSettings';
import VerbList from './pages/conjugacion/VerbList'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './pages/NotFound';
import VerbPreview from './pages/conjugacion/VerbPreview';
import ConjugationHistoryList from './pages/conjugacion/ConugationHistoryList';
import CodeEditor , { test }from './pages/vocabulary/CodeEditor';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path="*" element={<NotFound />} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/single/:verb' element={<VerbPreview/>} />
        <Route path='/all-verbs' element={<VerbList/>} />
        <Route path='/setup' element={<ConjugationsSettings/>} />
        <Route path='/game/sw001' element={<VerbQuiz typed={false} />} />
       <Route path='/game/history' element={<ConjugationHistoryList/>} />
       <Route path='/game/editor' element={<CodeEditor myMarkdown={test}/>} />
      </Routes>
    </div>
  );
}

export default App;
