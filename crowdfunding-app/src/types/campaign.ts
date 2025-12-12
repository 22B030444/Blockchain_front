// types/campaign.ts

export enum CampaignCategory {
    ART = 0,
    TECHNOLOGY = 1,
    EDUCATION = 2,
    CHARITY = 3,
    GAMING = 4,
    ECOLOGY = 5
}

export const CATEGORY_NAMES = {
    [CampaignCategory.ART]: 'Art 🎨',
    [CampaignCategory.TECHNOLOGY]: 'Technology 💻',
    [CampaignCategory.EDUCATION]: 'Education 📚',
    [CampaignCategory.CHARITY]: 'Charity ❤️',
    [CampaignCategory.GAMING]: 'Gaming 🎮',
    [CampaignCategory.ECOLOGY]: 'Ecology 🌱'
};

// 👇 ОСТАВЛЯЕМ ОБА: CampaignStatus (новый) и CampaignState (старый для совместимости)
export enum CampaignStatus {
    Active = 0,
    Successful = 1,
    Failed = 2,
    Completed = 3
}

// Алиас для обратной совместимости
export const CampaignState = CampaignStatus;

export interface Milestone {
    title: string;
    description: string;
    percentage: number;
    targetDate: number;
    completed: boolean;
    approved: boolean;
    votesFor: number;
    votesAgainst: number;
}

export interface Reward {
    minAmount: bigint;
    description: string;
    maxQuantity: number;
    claimed: number;
}

export interface Review {
    reviewer: string;
    rating: number;
    comment: string;
    timestamp: number;
}

export interface Campaign {
    id: number;
    creator: string;
    title: string;
    description: string;
    imageUrl: string;
    goal: bigint;
    deadline: number;
    amountCollected: bigint;
    category: CampaignCategory;
    state: CampaignStatus;
    minDonation: bigint;
    createdAt: number;
    fundsWithdrawn: boolean;
    milestones: Milestone[];
    rewards: Reward[];
    reviews: Review[];
    donorsCount: number;
    averageRating: number;
}

export interface Donation {
    campaignId: number;
    donor: string;
    amount: bigint;
    timestamp: number;
}