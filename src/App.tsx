import './App.css';
import VerbQuiz from './pages/conjugacion/VerbQuiz';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/settings/ConjugacionSettings';
import VerbList from './pages/conjugacion/VerbList'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Routes >
        <Route path="*" element={<NotFound />} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/all-verbs' element={<VerbList/>} />
        <Route path='/setup' element={<ConjugationsSettings/>} />
        <Route path='/game/sw001' element={<VerbQuiz range={50} typed={false} />} />
      </Routes>
    </div>
  );
}

export default App;
