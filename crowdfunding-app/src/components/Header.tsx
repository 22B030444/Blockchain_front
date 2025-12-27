import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, TrendingUp, LogOut, BarChart3 } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './ui/button';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [balance, setBalance] = useState<string>('0.00');
    const location = useLocation();
    const { account, connectWallet, disconnectWallet, provider } = useWeb3();

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
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
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
                        <Link
                            to="/statistics"
                            className={`transition-colors flex items-center gap-1 ${
                                isActive('/statistics') ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Statistics
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
                        <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
                                Create Campaign
                            </button>
                        </Link>

                        {account ? (
                            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Balance</div>
                                    <div className="font-semibold text-gray-900">{balance} ETH</div>
                                </div>
                                <Wallet className="w-5 h-5 text-indigo-600" />
                                <div className="border-l border-gray-300 pl-3 ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatAddress(account)}
                                    </div>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="ml-2 p-2 text-gray-600 hover:text-red-600 transition-colors"
                                    title="Disconnect"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Button onClick={connectWallet} variant="outline">
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </Button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/')
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/explore"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isActive('/explore')
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Explore
                            </Link>
                            <Link
                                to="/statistics"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    isActive('/statistics')
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Statistics
                            </Link>
                            {account && (
                                <Link
                                    to="/my-campaigns"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isActive('/my-campaigns')
                                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    My Campaigns
                                </Link>
                            )}

                            <div className="border-t pt-4 space-y-3">
                                <Link
                                    to="/create"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block"
                                >
                                    <Button variant="ghost" className="w-full">
                                        Create Campaign
                                    </Button>
                                </Link>

                                {account ? (
                                    <div className="space-y-3">
                                        <div className="bg-gray-100 px-4 py-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Balance</span>
                                                <span className="font-semibold">{balance} ETH</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatAddress(account)}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                disconnectWallet();
                                                setIsMenuOpen(false);
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Disconnect
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            connectWallet();
                                            setIsMenuOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Connect Wallet
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;