import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignState } from '../types/campaign';
import CampaignCard from '../components/campaigns/CampaignCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, PlusCircle, Rocket, TrendingUp, CheckCircle, XCircle } from 'lucide-react';


function MyCampaigns() {
    const navigate = useNavigate();
    const { account } = useWeb3();
    const { campaigns, loading, error } = useCampaigns();

    const myCampaigns = campaigns.filter(
        campaign => campaign.creator.toLowerCase() === account?.toLowerCase()
    );

    const activeCampaigns = myCampaigns.filter(c => c.state === CampaignState.Active);
    const successfulCampaigns = myCampaigns.filter(c => c.state === CampaignState.Successful);
    const completedCampaigns = myCampaigns.filter(c => c.state === CampaignState.Completed);
    const failedCampaigns = myCampaigns.filter(c => c.state === CampaignState.Failed);


    if (!account) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Rocket className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connection required</h2>
                        <p className="text-gray-600 mb-6">
                            Connect your wallet to view your campaigns
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
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
            value: myCampaigns.length,
            icon: Rocket,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Active',
            value: activeCampaigns.length,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Successful',
            value: successfulCampaigns.length + completedCampaigns.length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Failed',
            value: failedCampaigns.length,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ];


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            My campaigns
                        </h1>
                        <p className="text-gray-600">
                            Manage your projects and track progress
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/create')}
                        variant="ghost"
                        size="lg"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create a campaign
                    </Button>
                </div>


                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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


                {/* Список кампаний с вкладками */}
                {myCampaigns.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                You don't have any campaigns yet.
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Create your first campaign and start raising funds
                            </p>
                            <Button
                                onClick={() => navigate('/create')}
                                variant="ghost"
                                size="lg"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Create your first campaign
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <Tabs defaultValue="all" className="w-full">
                            <div className="border-b px-6 pt-6">
                                <TabsList className="w-full justify-start">
                                    <TabsTrigger value="all">
                                        All ({myCampaigns.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="active">
                                        Active ({activeCampaigns.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="successful">
                                        Successful ({successfulCampaigns.length + completedCampaigns.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="failed">
                                        Failed ({failedCampaigns.length})
                                    </TabsTrigger>
                                </TabsList>
                            </div>


                            <CardContent className="p-6">
                                <TabsContent value="all" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myCampaigns.map(campaign => (
                                            <CampaignCard
                                                key={campaign.id}
                                                campaign={campaign}
                                                showManageButton={true}
                                            />
                                        ))}
                                    </div>
                                </TabsContent>


                                <TabsContent value="active" className="mt-0">
                                    {activeCampaigns.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p>Нет активных кампаний</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeCampaigns.map(campaign => (
                                                <CampaignCard
                                                    key={campaign.id}
                                                    campaign={campaign}
                                                    showManageButton={true}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>


                                <TabsContent value="successful" className="mt-0">
                                    {[...successfulCampaigns, ...completedCampaigns].length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p>There are no successful campaigns yet</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[...successfulCampaigns, ...completedCampaigns].map(campaign => (
                                                <CampaignCard
                                                    key={campaign.id}
                                                    campaign={campaign}
                                                    showManageButton={true}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>


                                <TabsContent value="failed" className="mt-0">
                                    {failedCampaigns.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p>No failed campaigns - great job! 🎉</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {failedCampaigns.map(campaign => (
                                                <CampaignCard
                                                    key={campaign.id}
                                                    campaign={campaign}
                                                    showManageButton={true}  // Добавьте этот проп
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                )}
            </div>
        </div>
    );
}


export default MyCampaigns;


