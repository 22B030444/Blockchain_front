// components/milestones/MilestoneCard.tsx
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Milestone } from '../../types/campaign';
import { formatDate } from '../../utils/formatters';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
    Flag,
    CheckCircle,
    XCircle,
    Clock,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    AlertCircle,
    Vote,
    Wallet
} from 'lucide-react';

interface MilestoneCardProps {
    campaignId: number;
    milestoneIndex: number;
    milestone: Milestone;
    isCreator: boolean;
    isDonor: boolean;
    campaignSuccessful: boolean;
    onUpdate: () => void;
}

function MilestoneCard({
                           campaignId,
                           milestoneIndex,
                           milestone,
                           isCreator,
                           isDonor,
                           campaignSuccessful,
                           onUpdate
                       }: MilestoneCardProps) {
    const { contract, account } = useWeb3();
    const [hasVoted, setHasVoted] = useState<boolean | null>(null);
    const [loadingVoteStatus, setLoadingVoteStatus] = useState(true);
    const [voting, setVoting] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загружаем статус голосования пользователя
    useEffect(() => {
        const checkVoteStatus = async () => {
            if (!contract || !account) {
                setLoadingVoteStatus(false);
                return;
            }

            try {
                // Читаем напрямую из публичного маппинга milestoneVotes
                const voted = await contract.milestoneVotes(campaignId, milestoneIndex, account);
                setHasVoted(voted);
            } catch (err) {
                console.error('Error checking vote status:', err);
                setHasVoted(null);
            } finally {
                setLoadingVoteStatus(false);
            }
        };

        checkVoteStatus();
    }, [contract, account, campaignId, milestoneIndex]);

    // Голосование за milestone
    const handleVote = async (approve: boolean) => {
        if (!contract || !account) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setVoting(true);
            setError(null);

            console.log(`Voting ${approve ? 'FOR' : 'AGAINST'} milestone ${milestoneIndex}`);

            const tx = await contract.voteForMilestone(campaignId, milestoneIndex, approve);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Vote recorded successfully!');

            setHasVoted(true);
            onUpdate();
        } catch (err: any) {
            console.error('Error voting:', err);
            setError(err.reason || err.message || 'Failed to vote');
        } finally {
            setVoting(false);
        }
    };

    // Вывод средств по milestone (для создателя)
    const handleWithdraw = async () => {
        if (!contract || !account) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setWithdrawing(true);
            setError(null);

            console.log(`Withdrawing milestone ${milestoneIndex}`);

            const tx = await contract.withdrawMilestone(campaignId, milestoneIndex);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Withdrawal successful!');

            onUpdate();
        } catch (err: any) {
            console.error('Error withdrawing:', err);
            setError(err.reason || err.message || 'Failed to withdraw');
        } finally {
            setWithdrawing(false);
        }
    };

    // Вычисляем прогресс голосования
    const totalVotes = Number(milestone.votesFor) + Number(milestone.votesAgainst);
    const votesForPercentage = totalVotes > 0
        ? (Number(milestone.votesFor) / totalVotes) * 100
        : 0;

    // Определяем статус milestone
    const getStatus = () => {
        if (milestone.completed) {
            return { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
        }
        if (milestone.approved) {
            return { label: 'Approved', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
        }
        if (milestoneIndex === 0) {
            return { label: 'Initial Funding', color: 'bg-purple-100 text-purple-800', icon: Flag };
        }
        return { label: 'Pending Vote', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    };

    const status = getStatus();
    const StatusIcon = status.icon;

    // Можно ли голосовать
    const canVote = isDonor &&
        !hasVoted &&
        !milestone.approved &&
        !milestone.completed &&
        milestoneIndex > 0 &&
        campaignSuccessful;

    // Можно ли выводить средства
    const canWithdraw = isCreator &&
        campaignSuccessful &&
        !milestone.completed &&
        (milestoneIndex === 0 || milestone.approved);

    return (
        <Card className={`
            transition-all duration-200
            ${milestone.completed ? 'border-green-200 bg-green-50/30' : ''}
            ${milestone.approved && !milestone.completed ? 'border-blue-200 bg-blue-50/30' : ''}
        `}>
            <CardContent className="pt-5">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className={`
                                p-2 rounded-lg
                                ${milestone.completed ? 'bg-green-100' :
                                milestone.approved ? 'bg-blue-100' : 'bg-gray-100'}
                            `}>
                                <Flag className={`
                                    w-5 h-5
                                    ${milestone.completed ? 'text-green-600' :
                                    milestone.approved ? 'text-blue-600' : 'text-gray-500'}
                                `} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-gray-900">
                                        {milestone.title}
                                    </h4>
                                    <Badge className={status.color}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {status.label}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {milestone.description}
                                </p>
                            </div>
                        </div>

                        {/* Percentage badge */}
                        <Badge variant="outline" className="text-lg font-bold px-3 py-1 flex-shrink-0">
                            {milestone.percentage}%
                        </Badge>
                    </div>

                    {/* Target Date */}
                    {milestone.targetDate > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Target: {formatDate(milestone.targetDate)}</span>
                        </div>
                    )}

                    {/* Voting Progress (только для не-первых milestones) */}
                    {milestoneIndex > 0 && !milestone.completed && campaignSuccessful && (
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <Vote className="w-4 h-4" />
                                    Voting Progress
                                </span>
                                <span className="font-medium">
                                    {votesForPercentage.toFixed(0)}% approval
                                </span>
                            </div>

                            <div className="relative">
                                <Progress value={votesForPercentage} className="h-3" />
                                {/* 51% threshold marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                                    style={{ left: '51%' }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3 text-green-500" />
                                    For: {milestone.votesFor.toString()}
                                </span>
                                <span className="text-gray-400">51% needed</span>
                                <span className="flex items-center gap-1">
                                    <ThumbsDown className="w-3 h-3 text-red-500" />
                                    Against: {milestone.votesAgainst.toString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* User Vote Status */}
                    {isDonor && milestoneIndex > 0 && campaignSuccessful && (
                        <div className={`
                            p-3 rounded-lg border
                            ${hasVoted
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-amber-50 border-amber-200'
                        }
                        `}>
                            {loadingVoteStatus ? (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Checking vote status...</span>
                                </div>
                            ) : hasVoted ? (
                                <div className="flex items-center gap-2 text-blue-700">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">You have already voted on this milestone</span>
                                </div>
                            ) : milestone.approved ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">This milestone has been approved</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">You haven't voted yet</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        {/* Vote Buttons (for donors) */}
                        {canVote && (
                            <>
                                <Button
                                    onClick={() => handleVote(true)}
                                    disabled={voting}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                >
                                    {voting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                    )}
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleVote(false)}
                                    disabled={voting}
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                    size="sm"
                                >
                                    {voting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ThumbsDown className="w-4 h-4 mr-2" />
                                    )}
                                    Reject
                                </Button>
                            </>
                        )}

                        {/* Withdraw Button (for creator) */}
                        {canWithdraw && (
                            <Button
                                onClick={handleWithdraw}
                                disabled={withdrawing}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                size="sm"
                            >
                                {withdrawing ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Wallet className="w-4 h-4 mr-2" />
                                )}
                                Withdraw {milestone.percentage}%
                            </Button>
                        )}

                        {/* Connect wallet hint */}
                        {!account && isDonor && milestoneIndex > 0 && (
                            <p className="text-sm text-gray-500">
                                Connect wallet to vote
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default MilestoneCard;
