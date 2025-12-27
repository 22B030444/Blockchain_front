import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Button } from '../ui/button';
import {
    Loader2,
    Gift,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface ClaimRewardButtonProps {
    campaignId: number;
    rewardIndex: number;
    canClaim: boolean;
    reason?: string;
    hasClaimed: boolean;
    onSuccess: () => void;
}

function ClaimRewardButton({
                               campaignId,
                               rewardIndex,
                               canClaim,
                               reason,
                               hasClaimed,
                               onSuccess
                           }: ClaimRewardButtonProps) {
    const { contract, account } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleClaim = async () => {
        if (!contract || !account) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`Claiming reward ${rewardIndex} for campaign ${campaignId}`);

            const tx = await contract.claimReward(campaignId, rewardIndex);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Reward claimed successfully!');

            setSuccess(true);


            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            console.error('Error claiming reward:', err);
            setError(err.reason || err.message || 'Failed to claim reward');
        } finally {
            setLoading(false);
        }
    };


    if (hasClaimed || success) {
        return (
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Claimed</span>
            </div>
        );
    }


    if (!canClaim) {
        return (
            <div className="flex items-center gap-2 text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{reason || 'Not available'}</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Button
                onClick={handleClaim}
                disabled={loading || !account}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Claiming...
                    </>
                ) : (
                    <>
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Reward
                    </>
                )}
            </Button>

            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}

            {!account && (
                <p className="text-xs text-gray-500">Connect wallet to claim</p>
            )}
        </div>
    );
}

export default ClaimRewardButton;
