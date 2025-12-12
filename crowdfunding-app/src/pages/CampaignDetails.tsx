// pages/CampaignDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useCampaign } from '../hooks/useCampaign';
import { CampaignState, CATEGORY_NAMES } from '../types/campaign';
import DonateForm from '../components/campaigns/DonateForm';
import MilestonesList from '../components/milestones/MilestonesList';
import RewardsList from '../components/rewards/RewardsList';
import { formatEther, formatDate, getDaysRemaining, getProgressPercentage, formatAddress } from '../utils/formatters';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
    ArrowLeft,
    Loader2,
    Users,
    Clock,
    Target,
    TrendingUp,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Star,
    Gift,
    Flag
} from 'lucide-react';

function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { account, contract } = useWeb3();
    const campaignId = Number(id);
    const { campaign, loading, error } = useCampaign(campaignId);

    const [userDonation, setUserDonation] = useState<bigint>(0n);
    const [isDonor, setIsDonor] = useState(false);

    // Загрузка информации о донате пользователя
    useEffect(() => {
        const fetchUserDonation = async () => {
            if (!contract || !account || !campaign) return;

            try {
                const donation = await contract.getUserDonation(campaignId, account);
                setUserDonation(donation);
                setIsDonor(donation > 0n);
            } catch (err) {
                console.error('Ошибка загрузки доната:', err);
            }
        };

        fetchUserDonation();
    }, [contract, account, campaignId, campaign]);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Загрузка кампании...</h2>
                </div>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Кампания не найдена</h2>
                        <p className="text-gray-600 mb-6">Эта кампания не существует или была удалена</p>
                        <Button onClick={() => navigate('/')} variant="gradient">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Вернуться на главную
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const progress = getProgressPercentage(campaign.amountCollected, campaign.goal);
    const daysLeft = getDaysRemaining(campaign.deadline);
    const isCreator = account?.toLowerCase() === campaign.creator.toLowerCase();
    const isActive = campaign.state === CampaignState.Active;

    const getStateBadge = () => {
        switch (campaign.state) {
            case CampaignState.Active:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-base px-4 py-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Активна
                    </Badge>
                );
            case CampaignState.Successful:
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-base px-4 py-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Успешно завершена
                    </Badge>
                );
            case CampaignState.Failed:
                return (
                    <Badge variant="destructive" className="text-base px-4 py-1">
                        <XCircle className="w-4 h-4 mr-1" />
                        Провалена
                    </Badge>
                );
            case CampaignState.Completed:
                return (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-base px-4 py-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Завершена
                    </Badge>
                );
            default:
                return <Badge variant="secondary">Неизвестно</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Кнопка назад */}
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Левая колонка - основная информация */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Изображение и заголовок */}
                        <Card className="overflow-hidden">
                            <div className="relative aspect-video bg-gray-100">
                                <img
                                    src={campaign.imageUrl}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-black/70 hover:bg-black/70 backdrop-blur-sm text-base">
                                        {CATEGORY_NAMES[campaign.category]}
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4">
                                    {getStateBadge()}
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>Создатель: {formatAddress(campaign.creator)}</span>
                                    </div>
                                    {isCreator && (
                                        <Badge variant="secondary">Ваша кампания</Badge>
                                    )}
                                </div>

                                {/* Прогресс */}
                                <div className="space-y-3 mb-6">
                                    <Progress value={progress} className="h-3" />

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {formatEther(campaign.amountCollected)}
                                            </div>
                                            <div className="text-sm text-gray-600">ETH собрано</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {progress}%
                                            </div>
                                            <div className="text-sm text-gray-600">от цели</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatEther(campaign.goal)}
                                            </div>
                                            <div className="text-sm text-gray-600">ETH цель</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Статистика */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <Users className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Доноров</div>
                                            <div className="text-lg font-semibold">{campaign.donorsCount}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">
                                                {isActive && daysLeft > 0 ? 'Осталось' : 'Завершена'}
                                            </div>
                                            <div className="text-lg font-semibold">
                                                {isActive && daysLeft > 0
                                                    ? `${daysLeft} ${daysLeft === 1 ? 'день' : 'дней'}`
                                                    : formatDate(campaign.deadline)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ваш донат */}
                                {isDonor && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-900">Вы донор этой кампании</span>
                                        </div>
                                        <p className="text-sm text-green-700">
                                            Ваш вклад: <strong>{formatEther(userDonation)} ETH</strong>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Вкладки с контентом */}
                        <Card>
                            <Tabs defaultValue="description" className="w-full">
                                <CardHeader className="pb-4">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="description">Описание</TabsTrigger>
                                        <TabsTrigger value="milestones">
                                            Этапы ({campaign.milestones?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="rewards">
                                            Награды ({campaign.rewards?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="reviews">
                                            Отзывы ({campaign.reviews?.length || 0})
                                        </TabsTrigger>
                                    </TabsList>
                                </CardHeader>

                                <CardContent>
                                    <TabsContent value="description" className="mt-0">
                                        <div className="prose max-w-none">
                                            <h3 className="text-lg font-semibold mb-3">О проекте</h3>
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {campaign.description}
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="milestones" className="mt-0">
                                        {campaign.milestones && campaign.milestones.length > 0 ? (
                                            <MilestonesList
                                                campaignId={campaignId}
                                                milestones={campaign.milestones}
                                                isCreator={isCreator}
                                                isDonor={isDonor}
                                                onUpdate={handleRefresh}
                                            />
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Flag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p>Этапы не указаны</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="rewards" className="mt-0">
                                        {campaign.rewards && campaign.rewards.length > 0 ? (
                                            <RewardsList
                                                rewards={campaign.rewards}
                                                userDonation={userDonation}
                                            />
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p>Награды не предусмотрены</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reviews" className="mt-0">
                                        {campaign.reviews && campaign.reviews.length > 0 ? (
                                            <div className="space-y-4">
                                                {campaign.reviews.map((review, index) => (
                                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium">{formatAddress(review.reviewer)}</span>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${
                                                                            i < review.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{review.comment}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {formatDate(review.timestamp)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Star className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p>Отзывов пока нет</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </CardContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Правая колонка - форма доната */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <DonateForm
                                campaignId={campaignId}
                                campaign={campaign}
                                onSuccess={handleRefresh}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetails;
