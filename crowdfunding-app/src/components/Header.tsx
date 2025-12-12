import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, TrendingUp, LogOut } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [balance, setBalance] = useState<string>('0.00');
    const location = useLocation();
    const { account, connectWallet, disconnectWallet, isConnecting, provider } = useWeb3();

    useEffect(() => {
        const fetchBalance = async () => {
            if (account && provider) {
                try {
                    const bal = await provider.getBalance(account);
                    const ethBalance = (Number(bal) / 10**18).toFixed(4);
                    setBalance(ethBalance);
                } catch (err) {
                    console.error('Error fetching balance:', err);
                }
            }
        };
        fetchBalance();
    }, [account, provider]);

    const isActive = (path: string) => location.pathname === path;

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CrowdChain
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`transition-colors ${
                                isActive('/') ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className={`transition-colors ${
                                isActive('/explore') ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'
                            }`}
                        >
                            Explore
                        </Link>
                        {account && (
                            <Link
                                to="/my-campaigns"
                                className={`transition-colors ${
                                    isActive('/my-campaigns') ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'
                                }`}
                            >
                                My Campaigns
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/create">
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium">
                                Create Campaign
                            </button>
                        </Link>

                        {account ? (
                            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Balance</div>
                                    <div className="text-sm font-medium">{balance} ETH</div>
                                </div>
                                <div className="w-px h-8 bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-mono">{formatAddress(account)}</span>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                                    title="Disconnect"
                                >
                                    <LogOut className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                <Wallet className="w-4 h-4" />
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col gap-4">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg ${
                                    isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/explore"
                                className={`px-4 py-2 rounded-lg ${
                                    isActive('/explore') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            {account && (
                                <Link
                                    to="/my-campaigns"
                                    className={`px-4 py-2 rounded-lg ${
                                        isActive('/my-campaigns') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Campaigns
                                </Link>
                            )}
                            <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium">
                                    Create Campaign
                                </button>
                            </Link>
                            {!account ? (
                                <button
                                    onClick={() => {
                                        connectWallet();
                                        setIsMenuOpen(false);
                                    }}
                                    disabled={isConnecting}
                                    className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg disabled:opacity-50 font-medium"
                                >
                                    <Wallet className="w-4 h-4" />
                                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Balance:</span>
                                        <span className="text-sm font-medium">{balance} ETH</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Address:</span>
                                        <span className="text-sm font-mono">{formatAddress(account)}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            disconnectWallet();
                                            setIsMenuOpen(false);
                                        }}
                                        className="mt-2 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Disconnect
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}