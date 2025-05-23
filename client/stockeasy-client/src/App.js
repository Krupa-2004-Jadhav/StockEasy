import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TradeScreen from './components/TradeScreen';
import LearningTrack from './components/LearningTrack'; // Import LearningTrack
import PortfolioDetails from './components/PortfolioDetails'; // Import PortfolioDetails
import MarketAlerts from './components/MarketAlerts'; // Import MarketNews
import setupAxiosAuth from './axiosSetup';

// Call during app initialization
setupAxiosAuth();
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade" element={<TradeScreen />} />
        <Route path="/learn" element={<LearningTrack />} />
        <Route path="/portfolio" element={<PortfolioDetails />} />
        <Route path="/market-news" element={<MarketAlerts />} />
      </Routes>
    </Router>
  );
}

export default App;
