// pages/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCategory, CampaignState } from '../types/campaign';
import CampaignCard from '../components/campaigns/CampaignCard';
import CategoryFilter from '../components/campaigns/CategoryFilter';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, Users, Target, CheckCircle, Loader2 } from 'lucide-react';

function Home() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | null>(null);
    const { campaigns, loading, error } = useCampaigns(selectedCategory ?? undefined);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Loading campaigns...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">Loading error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total campaigns',
            value: campaigns.length,
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Successful',
            value: campaigns.filter(c => c.state === CampaignState.Successful).length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Active',
            value: campaigns.filter(c => c.state === CampaignState.Active).length,
            icon: Target,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Donors',
            value: campaigns.reduce((sum, c) => sum + c.donorsCount, 0),
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Баннер */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 mb-12 shadow-2xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative z-10 text-center text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                            Welcome to CrowdChain
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            A decentralized platform for funding innovative projects on the Ethereum blockchain.
                        </p>
                        <Button
                            onClick={() => navigate('/create')}
                            size="lg"
                            className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Create a campaign
                        </Button>
                    </div>

                    {/* Декоративные элементы */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full opacity-10 blur-3xl"></div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className={`text-4xl font-bold ${stat.color}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Заголовок секции */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Explore projects
                    </h2>
                    <p className="text-gray-600">
                        Find interesting projects and support their development
                    </p>
                </div>

                {/* Фильтр по категориям */}
                <div className="mb-8">
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Список кампаний */}
                {campaigns.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                There are no campaigns yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {selectedCategory !== null
                                    ? 'There are no campaigns in this category yet'
                                    : 'Be the first to create a campaign!'}
                            </p>
                            <Button
                                onClick={() => navigate('/create')}
                                variant="ghost"
                                size="lg"
                            >
                                Create a campaign
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
