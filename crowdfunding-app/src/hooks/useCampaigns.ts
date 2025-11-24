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
            if (!contract) return;

            try {
                setLoading(true);
                const count = await contract.getCampaignsCount();
                const campaignsData: Campaign[] = [];

                for (let i = 0; i < count; i++) {
                    const data = await contract.getCampaign(i);

                    // Фильтрация по категории если указана
                    if (category !== undefined && Number(data.category) !== category) {
                        continue;
                    }

                    campaignsData.push({
                        id: i,
                        creator: data.creator,
                        title: data.title,
                        description: data.description,
                        imageUrl: data.imageUrl,
                        goal: data.goal,
                        deadline: Number(data.deadline),
                        amountCollected: data.amountCollected,
                        category: Number(data.category),
                        state: Number(data.state),
                        milestones: [],
                        rewards: [],
                        reviews: [],
                        donorsCount: Number(data.donorsCount),
                        averageRating: Number(data.averageRating)
                    });
                }

                setCampaigns(campaignsData);
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки кампаний:', err);
                setError('Не удалось загрузить кампании');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [contract, category]);

    return { campaigns, loading, error };
};