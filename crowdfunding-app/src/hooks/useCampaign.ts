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
            if (!contract) return;

            try {
                setLoading(true);
                const data = await contract.getCampaign(campaignId);

                // Преобразуй данные из контракта в твой тип Campaign
                const campaignData: Campaign = {
                    id: campaignId,
                    creator: data.creator,
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    goal: data.goal,
                    deadline: Number(data.deadline),
                    amountCollected: data.amountCollected,
                    category: Number(data.category),
                    state: Number(data.state),
                    milestones: [], // Загрузим отдельно
                    rewards: [], // Загрузим отдельно
                    reviews: [], // Загрузим отдельно
                    donorsCount: Number(data.donorsCount),
                    averageRating: Number(data.averageRating)
                };

                setCampaign(campaignData);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки кампании:', err);
                setError('Не удалось загрузить кампанию');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [contract, campaignId]);

    return { campaign, loading, error };
};