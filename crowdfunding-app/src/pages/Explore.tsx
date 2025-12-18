// pages/Explore.tsx
import { useState } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCategory, CampaignState } from '../types/campaign';
import CampaignCard from '../components/campaigns/CampaignCard';
import CategoryFilter from '../components/campaigns/CategoryFilter';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
    Search,
    Loader2,
    Filter,
    SlidersHorizontal,
    X
} from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'most-funded' | 'ending-soon';

function Explore() {
    const { campaigns, loading, error } = useCampaigns();
    const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);
    // @ts-ignore
    const [statusFilter, setStatusFilter] = useState<CampaignState | null>(null);


    let filteredCampaigns = campaigns;


    if (selectedCategory !== null) {
        filteredCampaigns = filteredCampaigns.filter(
            campaign => campaign.category === selectedCategory
        );
    }

    // По статусу
    if (statusFilter !== null) {
        filteredCampaigns = filteredCampaigns.filter(
            campaign => campaign.state === statusFilter
        );
    }

    // По поисковому запросу
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(
            campaign =>
                campaign.title.toLowerCase().includes(query) ||
                campaign.description.toLowerCase().includes(query)
        );
    }

    // Сортировка
    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return Number(b.id) - Number(a.id);
            case 'oldest':
                return Number(a.id) - Number(b.id);
            case 'most-funded':
                return Number(b.amountCollected - a.amountCollected);
            case 'ending-soon':
                return Number(a.deadline) - Number(b.deadline);
            default:
                return 0;
        }
    });

    const activeFiltersCount = [
        selectedCategory !== null,
        statusFilter !== null,
        searchQuery.trim() !== ''
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedCategory(null);
        setStatusFilter(null);
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Загрузка проектов...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">Ошибка загрузки</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Обзор проектов
                    </h1>
                    <p className="text-gray-600">
                        Исследуйте инновационные проекты и поддержите идеи, которые вам нравятся
                    </p>
                </div>

                {/* Поиск и фильтры */}
                <div className="space-y-4 mb-8">
                    {/* Поисковая строка */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Поиск проектов по названию или описанию..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative"
                        >
                            <SlidersHorizontal className="w-5 h-5 mr-2" />
                            Фильтры
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Панель фильтров */}
                    {showFilters && (
                        <Card className="p-6">
                            <div className="space-y-6">
                                {/* Категории */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">Категория</h3>
                                        {selectedCategory !== null && (
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className="text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                Сбросить
                                            </button>
                                        )}
                                    </div>
                                    <CategoryFilter
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={setSelectedCategory}
                                    />
                                </div>

                                {/* Статус */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">Статус</h3>
                                        {statusFilter !== null && (
                                            <button
                                                onClick={() => setStatusFilter(null)}
                                                className="text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                Сбросить
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <Button
                                            variant={statusFilter === CampaignState.Active ? "default" : "outline"}
                                            onClick={() => setStatusFilter(
                                                statusFilter === CampaignState.Active ? null : CampaignState.Active
                                            )}
                                            className="justify-start"
                                        >
                                            Активные
                                        </Button>
                                        <Button
                                            variant={statusFilter === CampaignState.Successful ? "default" : "outline"}
                                            onClick={() => setStatusFilter(
                                                statusFilter === CampaignState.Successful ? null : CampaignState.Successful
                                            )}
                                            className="justify-start"
                                        >
                                            Успешные
                                        </Button>
                                        <Button
                                            variant={statusFilter === CampaignState.Completed ? "default" : "outline"}
                                            onClick={() => setStatusFilter(
                                                statusFilter === CampaignState.Completed ? null : CampaignState.Completed
                                            )}
                                            className="justify-start"
                                        >
                                            Завершенные
                                        </Button>
                                        <Button
                                            variant={statusFilter === CampaignState.Failed ? "default" : "outline"}
                                            onClick={() => setStatusFilter(
                                                statusFilter === CampaignState.Failed ? null : CampaignState.Failed
                                            )}
                                            className="justify-start"
                                        >
                                            Провалено
                                        </Button>
                                    </div>
                                </div>

                                {/* Кнопка очистки */}
                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="w-full"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Очистить все фильтры
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Сортировка и результаты */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Найдено проектов: <strong>{sortedCampaigns.length}</strong>
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Сортировка:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="newest">Сначала новые</option>
                            <option value="oldest">Сначала старые</option>
                            <option value="most-funded">Больше всего собрано</option>
                            <option value="ending-soon">Скоро завершаются</option>
                        </select>
                    </div>
                </div>

                {/* Список проектов */}
                {sortedCampaigns.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                Ничего не найдено
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Попробуйте изменить параметры поиска или фильтры
                            </p>
                            {activeFiltersCount > 0 && (
                                <Button onClick={clearFilters} variant="outline">
                                    Очистить фильтры
                                </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCampaigns.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Explore;
