// pages/Statistics.tsx
import { usePlatformStats } from '../hooks/usePlatformStats';
import { CATEGORY_NAMES } from '../types/campaign';
import { formatEther } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    Loader2,
    TrendingUp,
    DollarSign,
    Target,
    CheckCircle,
    Activity,
    Award,
    BarChart3,
    PieChart,
    Users
} from 'lucide-react';

function Statistics() {
    const { stats, loading, error } = usePlatformStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Loading statistics...</h2>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">Loading error</h2>
                    <p className="text-gray-600">{error || 'Failed to load statistics'}</p>
                </div>
            </div>
        );
    }

    // Calculate max for scaling charts
    const maxCategoryAmount = Math.max(...stats.categoryStats.map(c => Number(c.totalRaised)));
    const maxCategoryCount = Math.max(...stats.categoryStats.map(c => c.campaignCount));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Platform Statistics
                    </h1>
                    <p className="text-xl text-gray-600">
                        Real-time insights into our crowdfunding ecosystem
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Campaigns */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium mb-1">Total Campaigns</p>
                                    <p className="text-4xl font-bold text-blue-700">
                                        {stats.totalCampaigns}
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-100 rounded-xl">
                                    <TrendingUp className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Campaigns */}
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-xl transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 font-medium mb-1">Active Now</p>
                                    <p className="text-4xl font-bold text-orange-700">
                                        {stats.activeCampaigns}
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-100 rounded-xl">
                                    <Activity className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Successful Campaigns */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium mb-1">Successful</p>
                                    <p className="text-4xl font-bold text-green-700">
                                        {stats.successfulCampaigns}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-100 rounded-xl">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Raised */}
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium mb-1">Total Raised</p>
                                    <p className="text-3xl font-bold text-purple-700">
                                        {formatEther(stats.totalRaised)}
                                    </p>
                                    <p className="text-xs text-purple-600 mt-1">ETH</p>
                                </div>
                                <div className="p-4 bg-purple-100 rounded-xl">
                                    <DollarSign className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Success Rate */}
                <Card className="mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 mb-2 text-lg">Platform Success Rate</p>
                                <p className="text-6xl font-bold">{stats.successRate}%</p>
                                <p className="text-white/80 mt-2">
                                    {stats.successfulCampaigns} out of {stats.totalCampaigns} campaigns reached their goals
                                </p>
                            </div>
                            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <Target className="w-16 h-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Category Stats - Raised Amount */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-indigo-600" />
                                Funding by Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.categoryStats
                                    .filter(cat => cat.campaignCount > 0)
                                    .sort((a, b) => Number(b.totalRaised - a.totalRaised))
                                    .map((category) => {
                                        const percentage = maxCategoryAmount > 0
                                            ? (Number(category.totalRaised) / maxCategoryAmount) * 100
                                            : 0;

                                        return (
                                            <div key={category.category}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {CATEGORY_NAMES[category.category]}
                                                    </span>
                                                    <span className="text-sm font-bold text-indigo-600">
                                                        {formatEther(category.totalRaised)} ETH
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Stats - Campaign Count */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-6 h-6 text-purple-600" />
                                Campaigns by Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.categoryStats
                                    .filter(cat => cat.campaignCount > 0)
                                    .sort((a, b) => b.campaignCount - a.campaignCount)
                                    .map((category) => {
                                        const percentage = maxCategoryCount > 0
                                            ? (category.campaignCount / maxCategoryCount) * 100
                                            : 0;

                                        return (
                                            <div key={category.category}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {CATEGORY_NAMES[category.category]}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-purple-600">
                                                            {category.campaignCount}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            ({category.successRate}% success)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Campaigns Leaderboard */}
                {stats.topCampaigns.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-6 h-6 text-yellow-600" />
                                Top Funded Campaigns
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.topCampaigns.slice(0, 10).map((campaign, index) => (
                                    <div
                                        key={campaign.id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {/* Rank */}
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                                index === 0
                                                    ? 'bg-yellow-400 text-yellow-900'
                                                    : index === 1
                                                        ? 'bg-gray-300 text-gray-700'
                                                        : index === 2
                                                            ? 'bg-orange-300 text-orange-900'
                                                            : 'bg-gray-200 text-gray-600'
                                            }`}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Campaign Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {campaign.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {CATEGORY_NAMES[campaign.category as keyof typeof CATEGORY_NAMES] || 'Unknown'}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">
                                                {formatEther(campaign.currentAmount)} ETH
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Users className="w-3 h-3"/>
                                                {Number(campaign.totalDonors)} donors
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {stats.totalCampaigns === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="text-gray-400 text-6xl mb-4">📊</div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                No campaigns yet
                            </h3>
                            <p className="text-gray-500">
                                Be the first to create a campaign on our platform!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Statistics;