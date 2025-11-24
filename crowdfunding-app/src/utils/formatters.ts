// utils/formatters.ts
import { ethers } from 'ethers';

export const formatEther = (value: bigint): string => {
    return ethers.formatEther(value);
};

export const parseEther = (value: string): bigint => {
    return ethers.parseEther(value);
};

export const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
};

export const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString('ru-RU');
};

export const getDaysRemaining = (deadline: number): number => {
    const now = Math.floor(Date.now() / 1000);
    const diff = deadline - now;
    return Math.max(0, Math.floor(diff / 86400));
};

export const getProgressPercentage = (collected: bigint, goal: bigint): number => {
    if (goal === 0n) return 0;
    return Math.min(100, Number((collected * 100n) / goal));
};