import "./App.css";
import ResponsiveDrawerComp from "./components/Drawer/ResponsiveDrawerComp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import WaterPHLevel from "./pages/WaterPHLevel";
import LightMeter from "./pages/LightMeter";
import History from "./pages/History";
import PlantDetails from "./components/Plant/PlantDetails";
import AddPlant from "./components/Plant/AddPlant";
import ModifyPlant from "./components/Plant/ModifyPlant";

function App() {
  return (
    <Router>
      <div className="App">
        <ResponsiveDrawerComp></ResponsiveDrawerComp>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/addPlant" element={<AddPlant />} />
          <Route exact path="/plants" element={<Plants />} />
          <Route
            exact
            path="/plantDetails/:plantName"
            element={<PlantDetails />}
          />
          <Route
            exact
            path="/modifyPlant/:plantName"
            element={<ModifyPlant />}
          />
          <Route exact path="/waterPhLevel" element={<WaterPHLevel />} />
          <Route exact path="/lightMeter" element={<LightMeter />} />
          <Route exact path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
