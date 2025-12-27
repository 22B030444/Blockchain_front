import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import MyCampaigns from './pages/MyCampaigns';
import CampaignDashboard from './pages/CampaignDashboard';
import Statistics from './pages/Statistics';

function App() {
    return (
        <Web3Provider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Header />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/create" element={<CreateCampaign />} />
                            <Route path="/campaign/:id" element={<CampaignDetails />} />
                            <Route path="/campaign/:id/dashboard" element={<CampaignDashboard />} />
                            <Route path="/my-campaigns" element={<MyCampaigns />} />
                            <Route path="/statistics" element={<Statistics />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </Web3Provider>
    );
}

export default App;