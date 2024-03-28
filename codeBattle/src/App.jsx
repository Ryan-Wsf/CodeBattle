import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Addexercice from './pages/Addexercice';
import Home from './pages/Home';
import Deleteexercice from './pages/Deleteexercice';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/addexercice" element={<Addexercice />} />
        <Route path="/" element={<Home />} />
        <Route path="/deleteexercice" element={<Deleteexercice />} />
      </Routes>
    </Router>
  )}
export default App;
