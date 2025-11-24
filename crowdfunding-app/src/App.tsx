import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navbar';

function App() {
  return (
      <Web3Provider>
        <div className="App">
          <Navbar />
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Web3Provider>
  );
}

export default App;
