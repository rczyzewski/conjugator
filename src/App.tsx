import './App.css';
import VerbQuiz from './pages/conjugation/VerbQuiz';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/conjugation/ConjugationSettings';
import VerbList from './pages/conjugation/VerbList'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './pages/NotFound';
import VerbPreview from './pages/conjugation/VerbPreview';
import ConjugationHistoryList from './pages/conjugation/ConugationHistoryList';
import CodeEditor , { test }from './pages/vocabulary/CodeEditor';
import CourseView from './pages/CourseView';
import BookLoader from './book/BookLoader';

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
       <Route path='/course/:course' element={<CourseView />} />
       <Route path='/course/:course/chapter/:chapter' element={<BookLoader/>} />
      </Routes>
    </div>
  );
}

export default App;
