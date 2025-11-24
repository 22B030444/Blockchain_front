import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { Web3Provider } from './contexts/Web3Context';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import MyCampaigns from './pages/MyCampaigns';
import Navbar from './components/Navbar';

function App() {
  return (
      <Web3Provider>
      <Router>
        <div className="App">
          <Navbar />
            <main style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateCampaign />} />
                    <Route path="/campaign/:id" element={<CampaignDetails />} />
                    <Route path="/my-campaigns" element={<MyCampaigns />} />
                </Routes>
            </main>
        </div>
      </Router>
</Web3Provider>
  );
}

export default App;
