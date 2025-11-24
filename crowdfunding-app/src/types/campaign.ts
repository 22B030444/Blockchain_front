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

export enum CampaignState {
    ACTIVE = 0,
    SUCCESSFUL = 1,
    FAILED = 2
}

export interface Milestone {
    id: number;
    description: string;
    amount: bigint;
    isCompleted: boolean;
    isApproved: boolean;
    votesFor: number;
    votesAgainst: number;
    votingDeadline: number;
    // Milestone 0 = автоматический вывод (стартовый капитал)
    // Milestone 1+ = требуют одобрения доноров
}

export interface Reward {
    id: number;
    title: string;
    description: string;
    minDonation: bigint;
    totalQuantity: number;
    claimedQuantity: number;
}

export interface Review {
    donor: string;
    rating: number; // 1-5
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
    state: CampaignState;
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