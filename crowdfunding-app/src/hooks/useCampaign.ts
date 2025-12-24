// hooks/useCampaign.ts
import { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { Campaign } from '../types/campaign';

export const useCampaign = (campaignId: number) => {
    const { contract } = useContext(Web3Context);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!contract) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Loading campaign ID:', campaignId);

                // Проверяем существование кампании
                const campaignCounter = await contract.campaignCounter();
                if (campaignId >= Number(campaignCounter)) {
                    throw new Error('The campaign does not exist');
                }

                const data = await contract.getCampaign(campaignId);

                // Загружаем дополнительные данные
                const milestones = await contract.getCampaignMilestones(campaignId);
                const rewards = await contract.getCampaignRewards(campaignId);
                const reviews = await contract.getCampaignReviews(campaignId);
                const averageRating = await contract.getAverageRating(campaignId);

                const campaignData: Campaign = {
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
                };

                console.log('Campaign loaded:', campaignData);
                setCampaign(campaignData);
                setError(null);
            } catch (err) {
                console.error('Error loading campaign:', err);
                setError('Failed to load campaign');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [contract, campaignId]);

    return { campaign, loading, error };
};