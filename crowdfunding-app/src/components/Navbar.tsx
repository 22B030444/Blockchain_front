// components/Navbar.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';

function Navbar() {
    const { account, connectWallet, disconnectWallet, isConnecting } = useContext(Web3Context);

    return (
        <nav style={{
            padding: '20px',
            borderBottom: '2px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>
                    🚀 CrowdFund
                </Link>
                <Link to="/" style={{ textDecoration: 'none' }}>Главная</Link>
                <Link to="/create" style={{ textDecoration: 'none' }}>Создать</Link>
                {account && (
                    <Link to="/my-campaigns" style={{ textDecoration: 'none' }}>Мои кампании</Link>
                )}
            </div>

            <div>
                {!account ? (
                    <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isConnecting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isConnecting ? 'Подключение...' : 'Подключить MetaMask'}
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px'
            }}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
                        <button
                            onClick={disconnectWallet}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Отключить
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;