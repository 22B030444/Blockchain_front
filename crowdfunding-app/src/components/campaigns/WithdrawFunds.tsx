
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Campaign, CampaignState } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
    AlertCircle,
    Loader2,
    DollarSign,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

interface WithdrawFundsProps {
    campaignId: number;
    campaign: Campaign;
    onSuccess: () => void;
}

function WithdrawFunds({ campaignId, campaign, onSuccess }: WithdrawFundsProps) {
    const { contract, account } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isCreator = account?.toLowerCase() === campaign.creator.toLowerCase();
    const isSuccessful = campaign.state === CampaignState.Successful;
    const hasMilestones = campaign.milestones && campaign.milestones.length > 0;
    const alreadyWithdrawn = campaign.fundsWithdrawn;
    const availableAmount = campaign.amountCollected;

    const handleWithdraw = async () => {
        if (!contract || !account || !isCreator) {
            setError('Only the campaign creator can withdraw funds');
            return;
        }

        if (!isSuccessful) {
            setError('Campaign must be successful to withdraw funds');
            return;
        }

        if (alreadyWithdrawn) {
            setError('Funds have already been withdrawn');
            return;
        }

        if (hasMilestones) {
            setError('Campaign has milestones. Please use milestone withdrawal instead');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            console.log('Withdrawing funds for campaign:', campaignId);

            const tx = await contract.withdrawFunds(campaignId);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Funds withdrawn successfully!');

            setSuccess('Funds withdrawn successfully!');

            // Refresh the page after 2 seconds
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            console.error('Error withdrawing funds:', err);
            setError(err.reason || err.message || 'Error withdrawing funds');
        } finally {
            setLoading(false);
        }
    };

    if (!isCreator) {
        return null;
    }

    if (alreadyWithdrawn) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-green-900 mb-1">
                                Funds Already Withdrawn
                            </h3>
                            <p className="text-sm text-green-700">
                                You have successfully withdrawn all funds from this campaign.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (hasMilestones) {
        return (
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">
                                Milestone-Based Campaign
                            </h3>
                            <p className="text-sm text-blue-700">
                                This campaign has milestones. Please withdraw funds through the "Milestones" tab.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isSuccessful) {
        return (
            <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">
                                Campaign Not Successful Yet
                            </h3>
                            <p className="text-sm text-yellow-700">
                                Funds can only be withdrawn after the campaign successfully reaches its goal.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Main withdrawal card
    return (
        <Card className="border-2 border-green-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Withdraw Funds
                </CardTitle>
                <CardDescription>
                    Your campaign was successful! You can now withdraw the collected funds.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                )}

                {/* Amount Display */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Available to Withdraw</p>
                        <p className="text-4xl font-bold text-green-600 mb-1">
                            {formatEther(availableAmount)} ETH
                        </p>
                        <p className="text-xs text-gray-500">
                            From {campaign.donorsCount} {campaign.donorsCount === 1 ? 'donor' : 'donors'}
                        </p>
                    </div>
                </div>

                {/* Warning Notice */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Important:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>This action cannot be undone</li>
                                <li>All funds will be transferred to your wallet</li>
                                <li>Gas fees will be deducted from your wallet balance</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Withdraw Button */}
                <Button
                    onClick={handleWithdraw}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing Withdrawal...
                        </>
                    ) : (
                        <>
                            <DollarSign className="w-5 h-5 mr-2" />
                            Withdraw {formatEther(availableAmount)} ETH
                        </>
                    )}
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 text-center pt-2">
                    Funds will be sent to: {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
            </CardContent>
        </Card>
    );
}

export default WithdrawFunds;

