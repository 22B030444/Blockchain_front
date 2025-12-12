// pages/CreateCampaign.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { CampaignCategory, CATEGORY_NAMES } from '../types/campaign';
import { parseEther } from '../utils/formatters';
import { isValidAmount, isValidDeadline, isValidUrl } from '../utils/validators';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, Trash2, AlertCircle, Rocket, Image as ImageIcon, Target, Calendar, Tag } from 'lucide-react';

interface MilestoneInput {
    description: string;
    percentage: number;
}

interface RewardInput {
    title: string;
    description: string;
    minDonation: string;
    quantity: number;
}

function CreateCampaign() {
    const { contract, account } = useWeb3();
    const navigate = useNavigate();

    // Основные поля
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState<CampaignCategory>(CampaignCategory.TECHNOLOGY);

    // Milestones
    const [milestones, setMilestones] = useState<MilestoneInput[]>([
        { description: 'Стартовый капитал (автоматический вывод)', percentage: 30 }
    ]);

    // Rewards
    const [rewards, setRewards] = useState<RewardInput[]>([]);

    // Состояние
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Добавить milestone
    const addMilestone = () => {
        setMilestones([...milestones, { description: '', percentage: 0 }]);
    };

    // Удалить milestone (кроме первого)
    const removeMilestone = (index: number) => {
        if (index === 0) return;
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    // Обновить milestone
    const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
        const updated = [...milestones];
        updated[index] = { ...updated[index], [field]: value };
        setMilestones(updated);
    };

    // Добавить reward
    const addReward = () => {
        setRewards([...rewards, { title: '', description: '', minDonation: '', quantity: 0 }]);
    };

    // Удалить reward
    const removeReward = (index: number) => {
        setRewards(rewards.filter((_, i) => i !== index));
    };

    // Обновить reward
    const updateReward = (index: number, field: keyof RewardInput, value: string | number) => {
        const updated = [...rewards];
        updated[index] = { ...updated[index], [field]: value };
        setRewards(updated);
    };

    // Валидация
    const validate = (): string | null => {
        if (!title.trim()) return 'Укажите название';
        if (!description.trim()) return 'Укажите описание';
        if (!imageUrl.trim() || !isValidUrl(imageUrl)) return 'Укажите корректный URL изображения';
        if (!isValidAmount(goal)) return 'Укажите корректную цель сбора';
        if (!deadline || !isValidDeadline(deadline)) return 'Укажите корректный дедлайн';

        const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage), 0);
        if (totalPercentage !== 100) return 'Сумма процентов milestones должна быть 100%';

        for (let i = 0; i < milestones.length; i++) {
            if (!milestones[i].description.trim()) return `Milestone ${i}: укажите описание`;
            if (milestones[i].percentage <= 0) return `Milestone ${i}: процент должен быть > 0`;
        }

        for (let i = 0; i < rewards.length; i++) {
            if (!rewards[i].title.trim()) return `Reward ${i + 1}: укажите название`;
            if (!isValidAmount(rewards[i].minDonation)) return `Reward ${i + 1}: укажите корректную минимальную сумму`;
        }

        return null;
    };

    // Создание кампании
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contract || !account) {
            setError('Подключите кошелек');
            return;
        }

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

            const milestonesData = milestones.map(m => ({
                description: m.description,
                percentage: m.percentage
            }));

            const rewardsData = rewards.map(r => ({
                title: r.title,
                description: r.description,
                minDonation: parseEther(r.minDonation),
                quantity: r.quantity
            }));

            const tx = await contract.createCampaign(
                title,
                description,
                imageUrl,
                parseEther(goal),
                deadlineTimestamp,
                category,
                milestonesData,
                rewardsData
            );

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Кампания создана!');

            navigate('/');
        } catch (err: any) {
            console.error('Ошибка создания кампании:', err);
            setError(err.message || 'Ошибка создания кампании');
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Требуется подключение</h2>
                        <p className="text-gray-600">
                            Подключите кошелек MetaMask для создания кампании
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage), 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Создать кампанию
                    </h1>
                    <p className="text-gray-600">
                        Запустите свой проект и привлеките финансирование на блокчейне
                    </p>
                </div>

                {/* Ошибка */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Основная информация */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-indigo-600" />
                                Основная информация
                            </CardTitle>
                            <CardDescription>
                                Расскажите о вашем проекте
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Название */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Название кампании *
                                </label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Например: Инновационный проект в сфере AI"
                                    required
                                />
                            </div>

                            {/* Описание */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Описание *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Подробно опишите ваш проект, его цели и планы"
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    required
                                />
                            </div>

                            {/* URL изображения */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    URL изображения *
                                </label>
                                <Input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                                {imageUrl && (
                                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Категория */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Категория
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setCategory(Number(key) as CampaignCategory)}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                category === Number(key)
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Цель и дедлайн */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Цель сбора (ETH) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.001"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Дедлайн *
                                    </label>
                                    <Input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Milestones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Этапы проекта (Milestones)</CardTitle>
                            <CardDescription>
                                Milestone 0 (стартовый капитал) выводится автоматически.
                                Остальные этапы требуют одобрения доноров. Сумма процентов должна быть 100%.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant={index === 0 ? "default" : "secondary"}>
                                            Milestone {index} {index === 0 && '(Автоматический)'}
                                        </Badge>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(index)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            type="text"
                                            value={milestone.description}
                                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                            placeholder="Описание этапа"
                                            disabled={index === 0}
                                            required
                                        />

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Процент от цели: {milestone.percentage}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={milestone.percentage}
                                                onChange={(e) => updateMilestone(index, 'percentage', Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-2">
                                <div className={`text-sm font-medium ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                    Итого: {totalPercentage}% {totalPercentage === 100 ? '✓' : '(должно быть 100%)'}
                                </div>
                                <Button
                                    type="button"
                                    onClick={addMilestone}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Добавить этап
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rewards */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Награды (опционально)</CardTitle>
                            <CardDescription>
                                Предложите награды для доноров разных уровней
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rewards.map((reward, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge>Награда {index + 1}</Badge>
                                        <button
                                            type="button"
                                            onClick={() => removeReward(index)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            type="text"
                                            value={reward.title}
                                            onChange={(e) => updateReward(index, 'title', e.target.value)}
                                            placeholder="Название награды"
                                            required
                                        />

                                        <Input
                                            type="text"
                                            value={reward.description}
                                            onChange={(e) => updateReward(index, 'description', e.target.value)}
                                            placeholder="Описание награды"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={reward.minDonation}
                                                onChange={(e) => updateReward(index, 'minDonation', e.target.value)}
                                                placeholder="Мин. донат (ETH)"
                                                required
                                            />

                                            <Input
                                                type="number"
                                                value={reward.quantity}
                                                onChange={(e) => updateReward(index, 'quantity', Number(e.target.value))}
                                                placeholder="Количество (0 = неограничено)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={addReward}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Добавить награду
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Кнопка отправки */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="flex-1"
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Создание...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Создать кампанию
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCampaign;
