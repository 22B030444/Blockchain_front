// components/stats/PlatformStatsSection.tsx
import { usePlatformStats } from '../../hooks/usePlatformStats';
import { formatEther } from '../../utils/formatters';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    TrendingUp,
    DollarSign,
    CheckCircle,
    Activity,
    ArrowRight,
    Target
} from 'lucide-react';

function PlatformStatsSection() {
    const { stats, loading } = usePlatformStats();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="py-12 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                        <p className="text-gray-600 mt-2">Loading statistics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const statsData = [
        {
            label: 'Total Campaigns',
            value: stats.totalCampaigns.toLocaleString(),
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Active Campaigns',
            value: stats.activeCampaigns.toLocaleString(),
            icon: Activity,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            label: 'Successful Projects',
            value: stats.successfulCampaigns.toLocaleString(),
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            label: 'Total Raised',
            value: `${formatEther(stats.totalRaised)} ETH`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    ];

    return (
        <div className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Platform at a Glance
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join thousands of creators and supporters building the future
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, index) => (
                        <Card
                            key={index}
                            className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                        >
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${stat.color} mb-2`}>
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-4 ${stat.bgColor} rounded-xl ring-4 ring-white`}>
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Success Rate Banner */}
                <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-2xl mb-8">
                    <CardContent className="py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <Target className="w-12 h-12" />
                                </div>
                                <div>
                                    <p className="text-white/90 text-lg mb-1">Platform Success Rate</p>
                                    <p className="text-5xl font-bold">{stats.successRate}%</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-white/90 mb-2">
                                    {stats.successfulCampaigns} successful campaigns
                                </p>
                                <Button
                                    onClick={() => navigate('/statistics')}
                                    className="bg-white text-indigo-600 hover:bg-gray-100"
                                >
                                    View Detailed Stats
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Want to see more insights?
                    </p>
                    <Button
                        onClick={() => navigate('/statistics')}
                        variant="outline"
                        size="lg"
                        className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    >
                        Explore Full Statistics
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PlatformStatsSection;