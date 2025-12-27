import { useNavigate } from 'react-router-dom';
import { Campaign, CATEGORY_NAMES} from '../../types/campaign';

import {Clock, Settings, Users} from 'lucide-react';
import {Button} from "antd";

interface CampaignCardProps {
    campaign: Campaign;
    showManageButton?: boolean;
}

function CampaignCard({ campaign, showManageButton = false }: CampaignCardProps) {
    const navigate = useNavigate();

    const progress = campaign.goal > 0n
        ? Number((campaign.amountCollected * 100n) / campaign.goal)
        : 0;

    const amountCollected = Number(campaign.amountCollected) / 1e18;
    const goal = Number(campaign.goal) / 1e18;

    const deadline = new Date(Number(campaign.deadline) * 1000);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const stateColors: Record<number, string> = {
        0: 'bg-green-100 text-green-800',
        1: 'bg-blue-100 text-blue-800',
        2: 'bg-red-100 text-red-800',
        3: 'bg-purple-100 text-purple-800'
    };

    const stateNames: Record<number, string> = {
        0: 'Active',
        1: 'Successful',
        2: 'Failed',
        3: 'Finished'
    };

    const handleManageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/campaign/${campaign.id}/dashboard`);
    };


    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-xl">
            {/* Image */}
            <div
                className="relative h-48 bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/campaign/${campaign.id}`)}
            >
                <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                        {CATEGORY_NAMES[campaign.category]}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${stateColors[campaign.state] || 'bg-gray-100 text-gray-800'}`}>
                        {stateNames[campaign.state] || 'Unknown'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {campaign.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {campaign.description}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-indigo-600">
                            {amountCollected.toFixed(4)} ETH
                        </span>
                        <span className="text-gray-600">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        из {goal.toFixed(4)} ETH
                    </div>
                </div>

                {/* Manage Button */}
                {showManageButton && (
                    <div className="mb-4">
                        <Button
                            onClick={handleManageClick}
                            variant="outlined"
                            className="w-full"
                            size="small"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                        </Button>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.donorsCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{daysLeft > 0 ? `${daysLeft}д` : 'Finished'}</span>
                    </div>
                    {campaign.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span>{campaign.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CampaignCard;