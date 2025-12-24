// hooks/useCampaigns.ts
import { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { Campaign, CampaignCategory } from '../types/campaign';

export const useCampaigns = (category?: CampaignCategory) => {
    const { contract } = useContext(Web3Context);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (!contract) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Loading campaigns...');

                // Используем getAllCampaigns из контракта
                const allCampaigns = await contract.getAllCampaigns();
                console.log('Received campaigns:', allCampaigns.length);

                const campaignsData: Campaign[] = [];

                for (let i = 0; i < allCampaigns.length; i++) {
                    const data = allCampaigns[i];

                    // Фильтрация по категории если указана
                    if (category !== undefined && Number(data.category) !== category) {
                        continue;
                    }

                    // Загружаем дополнительные данные
                    const milestones = await contract.getCampaignMilestones(data.id);
                    const rewards = await contract.getCampaignRewards(data.id);
                    const reviews = await contract.getCampaignReviews(data.id);
                    const averageRating = await contract.getAverageRating(data.id);

                    campaignsData.push({
                        id: Number(data.id),
                        creator: data.creator,
                        title: data.title,
                        description: data.description,
                        imageUrl: data.imageHash, // В контракте это imageHash
                        goal: data.goalAmount,
                        deadline: Number(data.deadline),
                        amountCollected: data.currentAmount,
                        category: Number(data.category),
                        state: Number(data.status), // В контракте это status
                        minDonation: data.minDonation,
                        createdAt: Number(data.createdAt),
                        fundsWithdrawn: data.fundsWithdrawn,
                        milestones: milestones.map((m: any) => ({
                            title: m.title,
                            description: m.description,
                            percentage: Number(m.percentage),
                            targetDate: Number(m.targetDate),
                            completed: m.completed,
                            approved: m.approved,
                            votesFor: Number(m.votesFor),
                            votesAgainst: Number(m.votesAgainst)
                        })),
                        rewards: rewards.map((r: any) => ({
                            minAmount: r.minAmount,
                            description: r.description,
                            maxQuantity: Number(r.maxQuantity),
                            claimed: Number(r.claimed)
                        })),
                        reviews: reviews.map((r: any) => ({
                            reviewer: r.reviewer,
                            rating: Number(r.rating),
                            comment: r.comment,
                            timestamp: Number(r.timestamp)
                        })),
                        donorsCount: Number(data.totalDonors),
                        averageRating: Number(averageRating)
                    });
                }

                console.log('Processed campaigns:', campaignsData.length);
                setCampaigns(campaignsData);
                setError(null);
            } catch (err) {
                console.error('Error loading campaigns:', err);
                setError('Failed to load campaigns');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [contract, category]);

    return { campaigns, loading, error };
};