// components/rewards/RewardsList.tsx
import { Reward } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Gift, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface RewardsListProps {
    rewards: Reward[];
    userDonation?: bigint;
}

function RewardsList({ rewards, userDonation = 0n }: RewardsListProps) {
    if (rewards.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {rewards.map((reward, index) => {
                const isAvailable = reward.maxQuantity === 0 || reward.claimed < reward.maxQuantity;
                const isEligible = userDonation >= reward.minAmount;
                const remaining = reward.maxQuantity > 0 ? reward.maxQuantity - reward.claimed : null;

                return (
                    <Card
                        key={index}
                        className={`${
                            isEligible
                                ? 'border-green-200 bg-green-50/30'
                                : ''
                        } ${
                            !isAvailable ? 'opacity-60' : ''
                        }`}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                {/* Иконка */}
                                <div className={`p-3 rounded-lg flex-shrink-0 ${
                                    isEligible ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                    <Gift className={`w-6 h-6 ${
                                        isEligible ? 'text-green-600' : 'text-gray-600'
                                    }`} />
                                </div>

                                {/* Контент */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-1">
                                                {reward.description}
                                            </h3>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {isEligible && (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Доступно вам
                                                    </Badge>
                                                )}

                                                {!isAvailable && (
                                                    <Badge variant="destructive">
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Закончились
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="w-4 h-4 text-indigo-600" />
                                            <div>
                                                <div className="text-xs text-gray-500">Мин. донат</div>
                                                <div className="font-semibold text-gray-900">
                                                    {formatEther(reward.minAmount)} ETH
                                                </div>
                                            </div>
                                        </div>

                                        {reward.maxQuantity > 0 && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Gift className="w-4 h-4 text-purple-600" />
                                                <div>
                                                    <div className="text-xs text-gray-500">Доступно</div>
                                                    <div className="font-semibold text-gray-900">
                                                        {remaining} / {reward.maxQuantity}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {reward.maxQuantity === 0 && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Gift className="w-4 h-4 text-purple-600" />
                                                <div>
                                                    <div className="text-xs text-gray-500">Количество</div>
                                                    <div className="font-semibold text-gray-900">
                                                        Неограничено
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default RewardsList;
