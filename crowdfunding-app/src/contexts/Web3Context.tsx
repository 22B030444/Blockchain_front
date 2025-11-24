// contexts/Web3Context.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Contract, Signer } from 'ethers';
import { CROWDFUNDING_ABI, CONTRACT_ADDRESS } from '../contracts/CrowdfundingABI';

interface Web3ContextType {
    account: string | null;
    contract: Contract | null;
    provider: BrowserProvider | null;
    signer: Signer | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnecting: boolean;
}

export const Web3Context = createContext<Web3ContextType>({
    account: null,
    contract: null,
    provider: null,
    signer: null,
    connectWallet: async () => {},
    disconnectWallet: () => {},
    isConnecting: false,
});

interface Web3ProviderProps {
    children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        try {
            setIsConnecting(true);

            if (!window.ethereum) {
                alert('Пожалуйста, установите MetaMask!');
                return;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const userSigner = await browserProvider.getSigner();

            const crowdfundingContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CROWDFUNDING_ABI,
                userSigner
            );

            setAccount(accounts[0]);
            setProvider(browserProvider);
            setSigner(userSigner);
            setContract(crowdfundingContract);

            console.log('Подключен аккаунт:', accounts[0]);

        } catch (error) {
            console.error('Ошибка подключения:', error);
            alert('Ошибка подключения к MetaMask');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setContract(null);
        setProvider(null);
        setSigner(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setAccount(accounts[0]);
                    connectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts'
                });
                if (accounts.length > 0) {
                    connectWallet();
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <Web3Context.Provider
            value={{
                account,
                contract,
                provider,
                signer,
                connectWallet,
                disconnectWallet,
                isConnecting
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};