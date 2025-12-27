import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { useCampaign } from '../hooks/useCampaign';
import { CampaignState, CATEGORY_NAMES } from '../types/campaign';
import DonateForm from '../components/campaigns/DonateForm';
import WithdrawFunds from '../components/campaigns/WithdrawFunds';
import RefundForm from '../components/campaigns/RefundForm';
import MilestonesList from '../components/milestones/MilestonesList';
import RewardsList from '../components/rewards/RewardsList';
import AddReview from '../components/reviews/AddReview';
import ReviewsList from '../components/reviews/ReviewsList';
import DonorsTab from '../components/campaigns/DonorsTab';
import { formatEther, formatDate, getDaysRemaining, getProgressPercentage, formatAddress } from '../utils/formatters';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
    ArrowLeft,
    Loader2,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    User,
    Star,
    Gift,
    Flag,
    Settings
} from 'lucide-react';

function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { account, contract } = useWeb3();
    const campaignId = Number(id);
    const { campaign, loading, error } = useCampaign(campaignId);

    const [userDonation, setUserDonation] = useState<bigint>(0n);
    const [isDonor, setIsDonor] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const fetchUserDonation = async () => {
            if (!contract || !account || !campaign) return;

            try {
                const donation = await contract.getDonorContribution(campaignId, account);
                setUserDonation(donation);
                setIsDonor(donation > 0n);
            } catch (err) {
                console.error('Error loading donation:', err);
            }
        };

        fetchUserDonation();
    }, [contract, account, campaignId, campaign]);

    useEffect(() => {
        const checkReview = async () => {
            if (!contract || !account || !campaign) return;

            try {
                const reviewed = await contract.hasReviewed(campaignId, account);
                setHasReviewed(reviewed);
            } catch (err) {
                console.error('Review verification error:', err);
            }
        };

        checkReview();
    }, [contract, account, campaignId, campaign]);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">Loading campaign...</h2>
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
                        <h2 className="text-2xl font-bold mb-2">Campaign not found</h2>
                        <p className="text-gray-600 mb-6">This campaign does not exist or has been deleted.</p>
                        <Button onClick={() => navigate('/')} variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to home page
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
                        Active
                    </Badge>
                );
            case CampaignState.Successful:
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-base px-4 py-1">
                        Successfully completed
                    </Badge>
                );
            case CampaignState.Failed:
                return (
                    <Badge variant="destructive" className="text-base px-4 py-1">
                        <XCircle className="w-4 h-4 mr-1" />
                        Failed
                    </Badge>
                );
            case CampaignState.Completed:
                return (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-base px-4 py-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Finished
                    </Badge>
                );
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                {/* Management button for creator */}
                {isCreator && (
                    <Button
                        onClick={() => navigate(`/campaign/${campaignId}/dashboard`)}
                        className="mb-6 ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Campaign Management
                    </Button>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - main information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image and header */}
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
                                        <span>Creator: {formatAddress(campaign.creator)}</span>
                                    </div>
                                    {isCreator && (
                                        <Badge variant="secondary">Your campaign</Badge>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="space-y-3 mb-6">
                                    <Progress value={progress} className="h-3" />

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {formatEther(campaign.amountCollected)}
                                            </div>
                                            <div className="text-sm text-gray-600">ETH collected</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {progress}%
                                            </div>
                                            <div className="text-sm text-gray-600">of goal</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatEther(campaign.goal)}
                                            </div>
                                            <div className="text-sm text-gray-600">ETH goal</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <Users className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Donors</div>
                                            <div className="text-lg font-semibold">{campaign.donorsCount}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">
                                                {isActive && daysLeft > 0 ? 'Remaining' : 'Completed'}
                                            </div>
                                            <div className="text-lg font-semibold">
                                                {isActive && daysLeft > 0
                                                    ? `${daysLeft} days`
                                                    : formatDate(campaign.deadline)}
                                            </div>
                                        </div>
                                    </div>

                                    {campaign.averageRating > 0 && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <Star className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Rating</div>
                                                <div className="text-lg font-semibold">{campaign.averageRating.toFixed(1)} ⭐</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Your donation */}
                                {isDonor && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-900">You are a donor to this campaign</span>
                                        </div>
                                        <p className="text-sm text-green-700">
                                            Your contribution: <strong>{formatEther(userDonation)} ETH</strong>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tabs with content */}
                        <Card>
                            <Tabs defaultValue="description" className="w-full">
                                <CardHeader className="pb-4">
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="description">Description</TabsTrigger>
                                        <TabsTrigger value="milestones">
                                            Milestones ({campaign.milestones?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="rewards">
                                            Rewards ({campaign.rewards?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="donors">
                                            Donors ({campaign.donorsCount || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="reviews">
                                            Reviews ({campaign.reviews?.length || 0})
                                        </TabsTrigger>
                                    </TabsList>
                                </CardHeader>

                                <CardContent>
                                    <TabsContent value="description" className="mt-0">
                                        <div className="prose max-w-none">
                                            <h3 className="text-lg font-semibold mb-3">About the project</h3>
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
                                                <p>No milestones specified</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="rewards" className="mt-0">
                                        {campaign.rewards && campaign.rewards.length > 0 ? (
                                            <RewardsList
                                                campaignId={campaignId}
                                                rewards={campaign.rewards}
                                                userDonation={userDonation}
                                                campaignSuccessful={campaign.state === CampaignState.Successful || campaign.state === CampaignState.Completed}
                                                onUpdate={handleRefresh}
                                            />
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p>No rewards provided</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="donors" className="mt-0">
                                        <DonorsTab campaignId={campaignId} />
                                    </TabsContent>

                                    <TabsContent value="reviews" className="mt-0">
                                        <div className="space-y-6">
                                            {/* Add review form */}
                                            <AddReview
                                                campaignId={campaignId}
                                                campaign={campaign}
                                                isDonor={isDonor}
                                                hasReviewed={hasReviewed}
                                                onSuccess={handleRefresh}
                                            />

                                            {/* Reviews list */}
                                            <ReviewsList reviews={campaign.reviews || []} />
                                        </div>
                                    </TabsContent>
                                </CardContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Right column - donate/withdraw/refund forms */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Withdraw Funds - for creator of successful campaign */}
                            {isCreator && (
                                <WithdrawFunds
                                    campaignId={campaignId}
                                    campaign={campaign}
                                    onSuccess={handleRefresh}
                                />
                            )}

                            {/* Refund Form - for donors of failed campaign */}
                            {!isCreator && (
                                <RefundForm
                                    campaignId={campaignId}
                                    campaign={campaign}
                                    userDonation={userDonation}
                                    onSuccess={handleRefresh}
                                />
                            )}

                            {/* Donate Form - for active campaigns */}
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