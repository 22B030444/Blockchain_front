// components/campaigns/CampaignCard.tsx
import { useNavigate } from 'react-router-dom';
import { Campaign, CATEGORY_NAMES, CampaignState } from '../../types/campaign';
import { formatEther, formatDate, getDaysRemaining, getProgressPercentage } from '../../utils/formatters';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Clock, Users } from 'lucide-react';

interface CampaignCardProps {
    campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
    const navigate = useNavigate();
    const progress = getProgressPercentage(campaign.amountCollected, campaign.goal);
    const daysLeft = getDaysRemaining(campaign.deadline);
    const isActive = campaign.state === CampaignState.Active;

    const getStateBadge = () => {
        switch (campaign.state) {
            case CampaignState.Active:
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Активна</Badge>;
            case CampaignState.Successful:
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Успешна</Badge>;
            case CampaignState.Failed:
                return <Badge variant="destructive">Провалена</Badge>;
            case CampaignState.Completed:
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Завершена</Badge>;
            default:
                return <Badge variant="secondary">Неизвестно</Badge>;
        }
    };

    return (
        <Card
            onClick={() => navigate(`/campaign/${campaign.id}`)}
            className="cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
        >
            {/* Изображение */}
            <div className="relative aspect-video bg-gray-100">
                <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                />

                {/* Оверлей при наведении */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Категория */}
                <Badge className="absolute top-3 left-3 bg-black/70 hover:bg-black/70 backdrop-blur-sm">
                    {CATEGORY_NAMES[campaign.category]}
                </Badge>

                {/* Статус */}
                <div className="absolute top-3 right-3">
                    {getStateBadge()}
                </div>
            </div>

            <CardContent className="p-5">
                {/* Заголовок */}
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {campaign.title}
                </h3>

                {/* Описание */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {campaign.description}
                </p>

                {/* Прогресс */}
                <div className="space-y-2 mb-4">
                    <Progress value={progress} className="h-2" />

                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-lg font-bold text-indigo-600">
                                {formatEther(campaign.amountCollected)} ETH
                            </div>
                            <div className="text-xs text-gray-500">
                                из {formatEther(campaign.goal)} ETH
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{progress}%</div>
                            <div className="text-xs text-gray-500">собрано</div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-5 pt-0 flex justify-between text-sm text-gray-600 border-t">
                <div className="flex items-center gap-1.5 py-3">
                    <Users className="w-4 h-4" />
                    <span>{campaign.donorsCount}</span>
                </div>

                {isActive && daysLeft > 0 ? (
                    <div className="flex items-center gap-1.5 py-3 text-orange-600">
                        <Clock className="w-4 h-4" />
                        <span>{daysLeft} {daysLeft === 1 ? 'день' : 'дней'}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 py-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(campaign.deadline)}</span>
                    </div>
                )}

                {campaign.averageRating > 0 && (
                    <div className="flex items-center gap-1.5 py-3">
                        <span className="text-yellow-500">⭐</span>
                        <span>{campaign.averageRating.toFixed(1)}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

export default CampaignCard;
