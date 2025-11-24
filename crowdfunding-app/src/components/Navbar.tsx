// components/Navbar.tsx
import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

function Navbar() {
    const { account, connectWallet, disconnectWallet, isConnecting } = useContext(Web3Context);

    return (
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            {!account ? (
                <button onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? 'Подключение...' : 'Подключить MetaMask'}
                </button>
            ) : (
                <div>
          <span style={{ marginRight: '10px' }}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
                    <button onClick={disconnectWallet}>Отключить</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
