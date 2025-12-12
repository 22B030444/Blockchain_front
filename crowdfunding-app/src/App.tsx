import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import MyCampaigns from './pages/MyCampaigns';

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
                            <Route path="/my-campaigns" element={<MyCampaigns />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </Web3Provider>
    );
}

export default App;
