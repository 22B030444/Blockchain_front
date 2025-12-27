
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Campaign, CampaignState } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import {
    AlertCircle,
    Loader2,
    RotateCcw,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface RefundFormProps {
    campaignId: number;
    campaign: Campaign;
    userDonation: bigint;
    onSuccess: () => void;
}

function RefundForm({ campaignId, campaign, userDonation, onSuccess }: RefundFormProps) {
    const { contract, account } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isFailed = campaign.state === CampaignState.Failed;
    const hasDonated = userDonation > 0n;

    const handleRefund = async () => {
        if (!contract || !account) {
            setError('Please connect your wallet');
            return;
        }

        if (!hasDonated) {
            setError('You have not donated to this campaign');
            return;
        }

        if (!isFailed) {
            setError('Refunds are only available for failed campaigns');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            console.log('Requesting refund for campaign:', campaignId);

            const tx = await contract.refund(campaignId);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Refund successful!');

            setSuccess('Refund processed successfully!');

            // Refresh the page after 2 seconds
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            console.error('Error processing refund:', err);
            setError(err.reason || err.message || 'Error processing refund');
        } finally {
            setLoading(false);
        }
    };

    if (!hasDonated) {
        return null;
    }

    if (!isFailed) {
        return null;
    }

    return (
        <Card className="border-2 border-red-200 bg-red-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Campaign Failed - Refund Available
                </CardTitle>
                <CardDescription>
                    This campaign did not reach its funding goal. You can request a full refund of your contribution.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-900">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                )}

                {/* Refund Amount Display */}
                <div className="p-6 bg-white rounded-lg border-2 border-red-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Your Contribution</p>
                        <p className="text-4xl font-bold text-red-600 mb-1">
                            {formatEther(userDonation)} ETH
                        </p>
                        <p className="text-xs text-gray-500">
                            Will be refunded to your wallet
                        </p>
                    </div>
                </div>

                {/* Info Notice */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Refund Information:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>You will receive 100% of your contribution back</li>
                                <li>Funds will be returned to your wallet immediately</li>
                                <li>Gas fees for the transaction will apply</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Refund Button */}
                <Button
                    onClick={handleRefund}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing Refund...
                        </>
                    ) : (
                        <>
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Request Refund ({formatEther(userDonation)} ETH)
                        </>
                    )}
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 text-center pt-2">
                    Refund will be sent to: {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
            </CardContent>
        </Card>
    );
}

export default RefundForm;

