import './App.css';
import VerbList from './pages/conjugacion/VerbList';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/settings/ConjugacionSettings';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/conjugator/' element={<HomePage/>} />
        <Route path='/conjugator/setup' element={<ConjugationsSettings/>} />
        <Route path='/conjugator/game/sw001' element={<VerbList title='Basic exercise for spanish conjugation' range={10}/>} />
        <Route path='/conjugator/game/sw002' element={<VerbList title='Basic exercise for spanish conjugation' range={20}/>} />
        <Route path='/conjugator/game/sw003' element={<VerbList title='Basic exercise for spanish conjugation' range={30}/>} />
        <Route path='/conjugator/game/sw004' element={<VerbList title='Basic exercise for spanish conjugation' range={50}/>} />
        <Route path='/conjugator/game/sw005' element={<VerbList title='Basic exercise for spanish conjugation' range={70}/>} />
        <Route path='/conjugator/game/sw006' element={<VerbList title='Basic exercise for spanish conjugation' range={100}/>} />
      </Routes>
    </div>
  );
}

export default App;
