import './App.css';
import VerbQuiz from './pages/conjugacion/VerbQuiz';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/conjugacion/ConjugacionSettings';
import VerbList from './pages/conjugacion/VerbList'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './pages/NotFound';
import VerbPreview from './pages/conjugacion/VerbPreview';
import FillMissingWords from './pages/vocabulary/FillMissingWords';
import ConjugationHistoryList from './pages/conjugacion/ConugationHistoryList';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path="*" element={<NotFound />} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/single/:verb' element={<VerbPreview/>} />
        <Route path='/all-verbs' element={<VerbList/>} />
        <Route path='/setup' element={<ConjugationsSettings/>} />
        <Route path='/game/sw001' element={<VerbQuiz range={50} typed={false} />} />
        <Route path='/game/vocab' element={<FillMissingWords  />} />
       <Route path='/game/history' element={<ConjugationHistoryList/>} />
      </Routes>
    </div>
  );
}

export default App;
