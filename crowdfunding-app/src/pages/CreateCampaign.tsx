// pages/CreateCampaign.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { CampaignCategory, CATEGORY_NAMES } from '../types/campaign';
import { parseEther } from '../utils/formatters';
import { isValidAmount, isValidUrl } from '../utils/validators';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Loader2, AlertCircle, Rocket, Image as ImageIcon, Target, Calendar, Tag } from 'lucide-react';

function CreateCampaign() {
    const { contract, account } = useWeb3();
    const navigate = useNavigate();

    // Основные поля
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [goal, setGoal] = useState('');
    const [durationDays, setDurationDays] = useState('');
    const [minDonation, setMinDonation] = useState('0.001');
    const [category, setCategory] = useState<CampaignCategory>(CampaignCategory.TECHNOLOGY);

    // Состояние
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Валидация
    const validate = (): string | null => {
        if (!title.trim()) return 'Укажите название';
        if (!description.trim()) return 'Укажите описание';
        if (!imageUrl.trim() || !isValidUrl(imageUrl)) return 'Укажите корректный URL изображения';
        if (!isValidAmount(goal)) return 'Укажите корректную цель сбора';
        if (!durationDays || Number(durationDays) <= 0) return 'Укажите длительность кампании';
        if (!isValidAmount(minDonation)) return 'Укажите корректную минимальную сумму доната';

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

        const goalValue = parseFloat(goal);
        if (goalValue > 1000) {
            setError('Максимальная цель: 1000 ETH');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log('Отправка данных в контракт:', {
                title,
                description,
                imageUrl,
                category,
                goal: parseEther(goal),
                durationDays: Number(durationDays),
                minDonation: parseEther(minDonation)
            });

            // ПРАВИЛЬНЫЙ ВЫЗОВ ФУНКЦИИ КОНТРАКТА
            const tx = await contract.createCampaign(
                title,                              // string _title
                description,                        // string _description
                imageUrl,                          // string _imageHash
                Number(category),                  // Category _category
                parseEther(goal),                  // uint256 _goalAmount
                Number(durationDays),              // uint256 _durationDays
                parseEther(minDonation)            // uint256 _minDonation
            );

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Кампания создана!');

            navigate('/');
        } catch (err: any) {
            console.error('Ошибка создания кампании:', err);

            // Более детальная обработка ошибок
            let errorMessage = 'Ошибка создания кампании';
            if (err.reason) {
                errorMessage = err.reason;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
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
                                    Категория *
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

                            {/* Параметры финансирования */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Цель (ETH) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.001"
                                        value={goal}
                                        min="0.001"
                                        max="1000"
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Длительность (дней) *
                                    </label>
                                    <Input
                                        type="number"
                                        value={durationDays}
                                        onChange={(e) => setDurationDays(e.target.value)}
                                        placeholder="30"
                                        min="1"
                                        max="365"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Мин. донат (ETH) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.001"
                                        value={minDonation}
                                        onChange={(e) => setMinDonation(e.target.value)}
                                        placeholder="0.001"
                                        min="0.001"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Информационное сообщение */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Важная информация:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Milestones и rewards можно добавить позже через отдельные функции контракта</li>
                                        <li>После создания кампанию нельзя будет удалить</li>
                                        <li>Убедитесь, что все данные указаны корректно</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Кнопки */}
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
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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