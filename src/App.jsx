import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import MainPage from "./MainPage.jsx";
import DownloadCenter from "./DownloadCenter.jsx";
import MetodologiasSW from "./MetodologiasSW.jsx";
import Login from "./login.jsx";

function AppContent() {
  const location = useLocation();
  const isDarkLayout =
    location.pathname === "/" || location.pathname === "/documentacion";

  return (
    <div className={`App ${isDarkLayout ? "dark-layout" : ""}`}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/documentacion" element={<DownloadCenter />} />
        <Route path="/parcial_2" element={<MetodologiasSW />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
