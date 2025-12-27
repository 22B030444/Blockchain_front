// pages/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCategory } from '../types/campaign';
import CampaignCard from '../components/campaigns/CampaignCard';
import CategoryFilter from '../components/campaigns/CategoryFilter';
import PlatformStatsSection from '../components/stats/PlatformStatsSection';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mx-4 sm:mx-6 lg:mx-8 mt-8 mb-12 shadow-2xl">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10 text-center text-white px-6 py-16 lg:py-24">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                        Welcome to CrowdChain
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                        A decentralized platform for funding innovative projects on the Ethereum blockchain
                    </p>
                    <Button
                        onClick={() => navigate('/create')}
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Create Campaign
                    </Button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full opacity-10 blur-3xl"></div>
            </div>

            {/* Platform Statistics Section */}
            <PlatformStatsSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Explore Projects
                    </h2>
                    <p className="text-gray-600">
                        Find interesting projects and support their development
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                {/* Campaigns List */}
                {campaigns.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                No campaigns yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {selectedCategory !== null
                                    ? 'No campaigns in this category yet'
                                    : 'Be the first to create a campaign!'}
                            </p>
                            <Button
                                onClick={() => navigate('/create')}
                                variant="ghost"
                                size="lg"
                            >
                                Create Campaign
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