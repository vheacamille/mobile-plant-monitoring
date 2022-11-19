import './App.css';
import ResponsiveDrawerComp from './components/Drawer/ResponsiveDrawerComp';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Plants from './pages/Plants';
import WaterPHLevel from './pages/WaterPHLevel';
import LightMeter from './pages/LightMeter';
import History from './pages/History';

function App() {
  return (
    <Router>
    <div className="App">
      <ResponsiveDrawerComp></ResponsiveDrawerComp>

      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/plants" element={<Plants />} />
        <Route exact path="waterPhLevel" element={<WaterPHLevel />} />
        <Route exact path="/lightMeter" element={<LightMeter />} />
        <Route exact path="/history" element={<History />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
