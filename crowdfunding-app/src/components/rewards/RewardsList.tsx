import { Reward } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
    Gift,
    Users,
    Coins,
    CheckCircle
} from 'lucide-react';

interface RewardsListProps {
    campaignId: number;
    rewards: Reward[];
    userDonation: bigint;
    campaignSuccessful?: boolean;
    onUpdate?: () => void;
}

function RewardsList({
                         campaignId,
                         rewards,
                         userDonation,
                         campaignSuccessful = false,
                         onUpdate
                     }: RewardsListProps) {
    if (rewards.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No rewards available for this campaign</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-500" />
                    Backer Rewards
                </h3>
                {userDonation > 0n && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        You're a backer
                    </Badge>
                )}
            </div>

            {/* Информация о доступности наград */}
            {!campaignSuccessful && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-2">
                            <Gift className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-amber-800 font-medium">
                                    Rewards will be available after the campaign succeeds
                                </p>
                                <p className="text-xs text-amber-600 mt-1">
                                    Make sure to donate the minimum amount to qualify for a reward.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Список наград */}
            <div className="space-y-4">
                {rewards.map((reward, index) => {
                    const isEligible = userDonation >= reward.minAmount;
                    const claimedPercentage = reward.maxQuantity > 0
                        ? (reward.claimed / reward.maxQuantity) * 100
                        : 0;
                    const isSoldOut = reward.maxQuantity > 0 && reward.claimed >= reward.maxQuantity;

                    return (
                        <Card
                            key={index}
                            className={`
                                transition-all duration-200
                                ${isEligible ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}
                                ${isSoldOut ? 'opacity-60' : ''}
                            `}
                        >
                            <CardContent className="pt-5">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    {/* Информация о награде */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`
                                                p-2 rounded-lg
                                                ${isEligible ? 'bg-amber-100' : 'bg-gray-100'}
                                            `}>
                                                <Gift className={`
                                                    w-5 h-5
                                                    ${isEligible ? 'text-amber-600' : 'text-gray-400'}
                                                `} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge
                                                        variant="outline"
                                                        className={`
                                                            ${isEligible
                                                            ? 'border-amber-400 text-amber-700 bg-amber-50'
                                                            : 'border-gray-300 text-gray-600'
                                                        }
                                                        `}
                                                    >
                                                        <Coins className="w-3 h-3 mr-1" />
                                                        {formatEther(reward.minAmount)} ETH minimum
                                                    </Badge>
                                                    {isEligible && (
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Eligible
                                                        </Badge>
                                                    )}
                                                    {isSoldOut && (
                                                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                            Sold Out
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-2">
                                                    {reward.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Количество */}
                                        {reward.maxQuantity > 0 && (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        Claimed
                                                    </span>
                                                    <span className="font-medium">
                                                        {reward.claimed} / {reward.maxQuantity}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={claimedPercentage}
                                                    className="h-2"
                                                />
                                            </div>
                                        )}

                                        {reward.maxQuantity === 0 && (
                                            <p className="text-sm text-gray-500">
                                                <Users className="w-4 h-4 inline mr-1" />
                                                Unlimited availability • {reward.claimed} claimed
                                            </p>
                                        )}
                                    </div>

                                    {/* Статус для донора */}
                                    {campaignSuccessful && userDonation > 0n && (
                                        <div className="flex-shrink-0">
                                            {isEligible ? (
                                                <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                                                    ✓ You qualify for this reward
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500 px-3 py-2 rounded-lg bg-gray-50">
                                                    Need {formatEther(reward.minAmount - userDonation)} ETH more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Подсказка для не-доноров */}
            {userDonation === 0n && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-sm text-blue-800">
                            <strong>Want a reward?</strong> Donate at least the minimum amount shown above to be eligible for that reward tier.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default RewardsList;