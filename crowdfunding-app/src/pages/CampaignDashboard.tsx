// pages/CampaignDashboard.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useCampaign } from '../hooks/useCampaign';
import { parseEther } from '../utils/formatters';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertCircle, Plus, Trash2, Loader2, Flag, Gift, ArrowLeft, DollarSign } from 'lucide-react';

interface MilestoneForm {
    title: string;
    description: string;
    percentage: number;
    durationDays: number;
}

interface RewardForm {
    minAmount: string;
    description: string;
    maxQuantity: number;
}

function CampaignDashboard() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { account, contract } = useWeb3();
    const campaignId = Number(id);
    const { campaign, loading: campaignLoading } = useCampaign(campaignId);

    // Milestones
    const [milestones, setMilestones] = useState<MilestoneForm[]>([]);
    const [newMilestone, setNewMilestone] = useState<MilestoneForm>({
        title: '',
        description: '',
        percentage: 0,
        durationDays: 30
    });

    // Rewards
    const [rewards, setRewards] = useState<RewardForm[]>([]);
    const [newReward, setNewReward] = useState<RewardForm>({
        minAmount: '',
        description: '',
        maxQuantity: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Проверка прав доступа
    const isCreator = account?.toLowerCase() === campaign?.creator.toLowerCase();

    useEffect(() => {
        if (campaign && !isCreator) {
            navigate(`/campaign/${campaignId}`);
        }
    }, [campaign, isCreator, campaignId, navigate]);

    // Добавление Milestone
    const handleAddMilestone = async () => {
        if (!contract || !campaign) return;

        setError(null);
        setSuccess(null);

        // Валидация
        if (!newMilestone.title.trim()) {
            setError('Укажите название этапа');
            return;
        }
        if (newMilestone.percentage <= 0 || newMilestone.percentage > 100) {
            setError('Процент должен быть от 1 до 100');
            return;
        }

        // Проверка суммы процентов
        const existingMilestones = campaign.milestones || [];
        const totalPercentage = existingMilestones.reduce((sum, m) => sum + m.percentage, 0) + newMilestone.percentage;

        if (totalPercentage > 100) {
            setError(`Сумма процентов превышает 100% (текущая: ${totalPercentage}%)`);
            return;
        }

        try {
            setLoading(true);

            const tx = await contract.addMilestone(
                campaignId,
                newMilestone.title,
                newMilestone.description,
                newMilestone.percentage,
                newMilestone.durationDays
            );

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Milestone добавлен!');

            setSuccess('Этап успешно добавлен!');
            setNewMilestone({
                title: '',
                description: '',
                percentage: 0,
                durationDays: 30
            });

            // Обновляем страницу
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            console.error('Ошибка добавления milestone:', err);
            setError(err.reason || err.message || 'Ошибка добавления этапа');
        } finally {
            setLoading(false);
        }
    };

    // Добавление Reward
    const handleAddReward = async () => {
        if (!contract || !campaign) return;

        setError(null);
        setSuccess(null);

        // Валидация
        if (!newReward.description.trim()) {
            setError('Укажите описание награды');
            return;
        }
        if (!newReward.minAmount || parseFloat(newReward.minAmount) <= 0) {
            setError('Укажите минимальную сумму доната');
            return;
        }

        try {
            setLoading(true);

            const tx = await contract.addReward(
                campaignId,
                parseEther(newReward.minAmount),
                newReward.description,
                newReward.maxQuantity
            );

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Reward добавлена!');

            setSuccess('Награда успешно добавлена!');
            setNewReward({
                minAmount: '',
                description: '',
                maxQuantity: 0
            });

            // Обновляем страницу
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: any) {
            console.error('Ошибка добавления reward:', err);
            setError(err.reason || err.message || 'Ошибка добавления награды');
        } finally {
            setLoading(false);
        }
    };

    if (campaignLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!campaign || !isCreator) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Нет доступа</h2>
                        <p className="text-gray-600">Вы не являетесь создателем этой кампании</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const existingMilestones = campaign.milestones || [];
    const existingRewards = campaign.rewards || [];
    const totalPercentage = existingMilestones.reduce((sum, m) => sum + m.percentage, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={() => navigate(`/campaign/${campaignId}`)}
                        variant="ghost"
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        К кампании
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Управление кампанией
                    </h1>
                    <p className="text-gray-600">{campaign.title}</p>
                </div>

                {/* Сообщения */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                <Tabs defaultValue="milestones" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="milestones">
                            <Flag className="w-4 h-4 mr-2" />
                            Этапы проекта
                        </TabsTrigger>
                        <TabsTrigger value="rewards">
                            <Gift className="w-4 h-4 mr-2" />
                            Награды
                        </TabsTrigger>
                    </TabsList>

                    {/* MILESTONES TAB */}
                    <TabsContent value="milestones">
                        <Card>
                            <CardHeader>
                                <CardTitle>Добавить этап проекта</CardTitle>
                                <CardDescription>
                                    Первый milestone (0) выводится автоматически как стартовый капитал.
                                    Остальные требуют одобрения доноров. Всего использовано: {totalPercentage}%
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Существующие milestones */}
                                {existingMilestones.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3">Текущие этапы:</h3>
                                        <div className="space-y-2">
                                            {existingMilestones.map((milestone, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-semibold">Этап {index}</span>
                                                            {index === 0 && (
                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                    Автоматический
                                                                </span>
                                                            )}
                                                            <p className="text-sm text-gray-600 mt-1">{milestone.title}</p>
                                                        </div>
                                                        <span className="text-2xl font-bold text-indigo-600">
                                                            {milestone.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Форма добавления */}
                                {totalPercentage < 100 ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Название этапа *
                                            </label>
                                            <Input
                                                type="text"
                                                value={newMilestone.title}
                                                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                                                placeholder="Например: Разработка MVP"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Описание
                                            </label>
                                            <textarea
                                                value={newMilestone.description}
                                                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                                                placeholder="Детальное описание этапа"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Процент от цели * (доступно: {100 - totalPercentage}%)
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={100 - totalPercentage}
                                                    value={newMilestone.percentage || ''}
                                                    onChange={(e) => setNewMilestone({...newMilestone, percentage: Number(e.target.value)})}
                                                    placeholder="20"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Длительность (дней) *
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={newMilestone.durationDays || ''}
                                                    onChange={(e) => setNewMilestone({...newMilestone, durationDays: Number(e.target.value)})}
                                                    placeholder="30"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleAddMilestone}
                                            disabled={loading}
                                            className="w-full"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Добавление...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Добавить этап
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                        <p className="text-green-800 font-medium">
                                            ✓ Все 100% распределены
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* REWARDS TAB */}
                    <TabsContent value="rewards">
                        <Card>
                            <CardHeader>
                                <CardTitle>Добавить награду</CardTitle>
                                <CardDescription>
                                    Создайте награды для доноров разных уровней (максимум 5)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Существующие rewards */}
                                {existingRewards.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3">Текущие награды:</h3>
                                        <div className="space-y-2">
                                            {existingRewards.map((reward, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{reward.description}</p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Мин. донат: {Number(reward.minAmount) / 1e18} ETH
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Количество: {reward.maxQuantity === 0 ? 'Неограничено' : `${reward.claimed}/${reward.maxQuantity}`}
                                                            </p>
                                                        </div>
                                                        <Gift className="w-8 h-8 text-purple-600" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Форма добавления */}
                                {existingRewards.length < 5 ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Описание награды *
                                            </label>
                                            <Input
                                                type="text"
                                                value={newReward.description}
                                                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                                                placeholder="Например: Эксклюзивный доступ к бета-версии"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Минимальный донат (ETH) *
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="0.001"
                                                    min="0.001"
                                                    value={newReward.minAmount}
                                                    onChange={(e) => setNewReward({...newReward, minAmount: e.target.value})}
                                                    placeholder="0.1"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Количество (0 = неограничено)
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={newReward.maxQuantity || ''}
                                                    onChange={(e) => setNewReward({...newReward, maxQuantity: Number(e.target.value)})}
                                                    placeholder="100"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleAddReward}
                                            disabled={loading}
                                            className="w-full"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Добавление...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Добавить награду
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                        <p className="text-yellow-800 font-medium">
                                            Достигнут лимит наград (5)
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default CampaignDashboard;