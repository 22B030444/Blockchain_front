import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Milestone } from '../../types/campaign';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';
import { AlertCircle, Loader2, ThumbsUp, ThumbsDown, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface MilestonesListProps {
    campaignId: number;
    milestones: Milestone[];
    isCreator: boolean;
    isDonor: boolean;
    onUpdate: () => void;
}

function MilestonesList({ campaignId, milestones, isCreator, isDonor, onUpdate }: MilestonesListProps) {
    const { contract } = useWeb3();
    const [loading, setLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async (milestoneIndex: number, voteFor: boolean) => {
        if (!contract) return;

        try {
            setLoading(milestoneIndex);
            setError(null);

            const tx = await contract.voteForMilestone(campaignId, milestoneIndex, voteFor);
            await tx.wait();

            onUpdate();
        } catch (err: any) {
            console.error('Voting error:', err);
            setError(err.message || 'Voting error');
        } finally {
            setLoading(null);
        }
    };

    const handleWithdraw = async (milestoneIndex: number) => {
        if (!contract) return;

        try {
            setLoading(milestoneIndex);
            setError(null);

            const tx = await contract.withdrawMilestone(campaignId, milestoneIndex);
            await tx.wait();

            onUpdate();
        } catch (err: any) {
            console.error('Output error:', err);
            setError(err.message || 'Withdrawal error');
        } finally {
            setLoading(null);
        }
    };

    if (milestones.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {milestones.map((milestone, index) => {
                const totalVotes = milestone.votesFor + milestone.votesAgainst;
                const approvalRate = totalVotes > 0
                    ? Math.round((milestone.votesFor / totalVotes) * 100)
                    : 0;
                const isAutomatic = index === 0;

                return (
                    <Card
                        key={index}
                        className={`${
                            milestone.completed
                                ? 'bg-green-50 border-green-200'
                                : isAutomatic
                                    ? 'border-blue-200 bg-blue-50/30'
                                    : ''
                        }`}
                    >
                        <CardContent className="p-5">
                            {/* Заголовок */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold">
                                            Stage {index}
                                        </h3>
                                        {isAutomatic && (
                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                Auto
                                            </Badge>
                                        )}
                                        {!isAutomatic && milestone.approved && (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Approved
                                            </Badge>
                                        )}
                                        {milestone.completed && (
                                            <Badge className="bg-green-600 text-white hover:bg-green-600">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Withdrawn
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-gray-700">{milestone.title || milestone.description}</p>
                                </div>

                                <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {milestone.percentage}%
                                    </div>
                                    <div className="text-sm text-gray-500">от цели</div>
                                </div>
                            </div>

                            {/* Голосование (только для milestone 1+) */}
                            {!isAutomatic && !milestone.completed && (
                                <div className="space-y-3 pt-3 border-t">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="w-4 h-4 text-green-600" />
                                            For: {milestone.votesFor}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ThumbsDown className="w-4 h-4 text-red-600" />
                                            Against: {milestone.votesAgainst}
                                        </span>
                                        <span className="font-medium">
                                            Approval: {approvalRate}%
                                        </span>
                                    </div>

                                    <Progress
                                        value={approvalRate}
                                        className={`h-2 ${approvalRate >= 51 ? 'bg-green-100' : 'bg-red-100'}`}
                                    />

                                    {/* Кнопки голосования для доноров */}
                                    {isDonor && !milestone.approved && (
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => handleVote(index, true)}
                                                disabled={loading === index}
                                                variant="outline"
                                                className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                                            >
                                                {loading === index ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                                        For
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleVote(index, false)}
                                                disabled={loading === index}
                                                variant="outline"
                                                className="flex-1 border-red-600 text-red-700 hover:bg-red-50"
                                            >
                                                {loading === index ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ThumbsDown className="w-4 h-4 mr-1" />
                                                        Against
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Кнопка вывода для создателя */}
                            {isCreator && !milestone.completed && (
                                <div className="pt-3 border-t mt-3">
                                    {(isAutomatic || milestone.approved) ? (
                                        <Button
                                            onClick={() => handleWithdraw(index)}
                                            disabled={loading === index}
                                            variant="default"
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            {loading === index ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <DollarSign className="w-4 h-4 mr-2" />
                                                    Withdraw funds
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
                                            <Clock className="w-4 h-4" />
                                            <span>Waiting for donor approval (51% required)</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default MilestonesList;
