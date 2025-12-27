// hooks/usePlatformStats.ts
import { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { CampaignCategory } from '../types/campaign';

export interface PlatformStats {
    totalCampaigns: number;
    activeCampaigns: number;
    successfulCampaigns: number;
    totalRaised: bigint;
    successRate: number;
    categoryStats: CategoryStats[];
    topCampaigns: any[];
}

export interface CategoryStats {
    category: CampaignCategory;
    campaignCount: number;
    successCount: number;
    totalRaised: bigint;
    successRate: number;
}

export const usePlatformStats = () => {
    const { contract } = useContext(Web3Context);
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!contract) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Loading platform statistics...');

                // Get platform stats
                const platformStats = await contract.getPlatformStats();
                console.log('Platform stats:', platformStats);

                // Calculate success rate
                const successRate = platformStats[0] > 0
                    ? Math.round((Number(platformStats[2]) / Number(platformStats[0])) * 100)
                    : 0;

                // Get category stats
                const categoryStats: CategoryStats[] = [];
                for (let i = 0; i <= 5; i++) { // 6 categories (0-5)
                    try {
                        const catStats = await contract.getCategoryStats(i);
                        categoryStats.push({
                            category: i as CampaignCategory,
                            campaignCount: Number(catStats[0]),
                            successCount: Number(catStats[1]),
                            totalRaised: catStats[2],
                            successRate: catStats[0] > 0
                                ? Math.round((Number(catStats[1]) / Number(catStats[0])) * 100)
                                : 0
                        });
                    } catch (err) {
                        console.error(`Error loading category ${i} stats:`, err);
                    }
                }

                // Get top campaigns (limit to 10)
                let topCampaigns = [];
                try {
                    const campaignCounter = await contract.campaignCounter();
                    const limit = Math.min(10, Number(campaignCounter));
                    if (limit > 0) {
                        topCampaigns = await contract.getTopCampaigns(limit);
                    }
                } catch (err) {
                    console.error('Error loading top campaigns:', err);
                }

                const statsData: PlatformStats = {
                    totalCampaigns: Number(platformStats[0]),
                    activeCampaigns: Number(platformStats[1]),
                    successfulCampaigns: Number(platformStats[2]),
                    totalRaised: platformStats[3],
                    successRate,
                    categoryStats,
                    topCampaigns
                };

                console.log('Stats loaded:', statsData);
                setStats(statsData);
                setError(null);
            } catch (err) {
                console.error('Error loading statistics:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [contract]);

    return { stats, loading, error };
};