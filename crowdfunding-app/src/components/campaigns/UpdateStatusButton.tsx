// components/campaigns/UpdateStatusButton.tsx
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Campaign, CampaignState } from '../../types/campaign';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
    AlertCircle,
    Loader2,
    RefreshCw,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

interface UpdateStatusButtonProps {
    campaignId: number;
    campaign: Campaign;
    onSuccess: () => void;
}

function UpdateStatusButton({ campaignId, campaign, onSuccess }: UpdateStatusButtonProps) {
    const { contract, account } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Проверяем, можно ли обновить статус
    const now = Math.floor(Date.now() / 1000);
    const isDeadlinePassed = now >= campaign.deadline;
    const isActive = campaign.state === CampaignState.Active;
    const canUpdateStatus = isActive && isDeadlinePassed;

    // Предсказываем результат
    const willBeSuccessful = campaign.amountCollected >= campaign.goal;

    const handleUpdateStatus = async () => {
        if (!contract || !account) {
            setError('Please connect your wallet');
            return;
        }

        if (!canUpdateStatus) {
            setError('Cannot update status yet');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            console.log('Updating campaign status:', campaignId);

            const tx = await contract.updateCampaignStatus(campaignId);
            console.log('Transaction sent:', tx.hash);

            await tx.wait();
            console.log('Status updated successfully!');

            const newStatus = willBeSuccessful ? 'Successful' : 'Failed';
            setSuccess(`Campaign status updated to: ${newStatus}`);

            // Обновляем страницу через 2 секунды
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            console.error('Error updating status:', err);
            setError(err.reason || err.message || 'Error updating campaign status');
        } finally {
            setLoading(false);
        }
    };

    // Не показываем, если кампания уже не активна
    if (!isActive) {
        return null;
    }

    // Кампания ещё активна (дедлайн не прошёл)
    if (!isDeadlinePassed) {
        const daysLeft = Math.ceil((campaign.deadline - now) / 86400);

        return (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">
                                Campaign is Active
                            </h3>
                            <p className="text-sm text-blue-700">
                                {daysLeft > 0
                                    ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining until deadline`
                                    : 'Less than a day remaining'
                                }
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                                Status can be finalized after the deadline passes.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Дедлайн прошёл, можно обновить статус
    return (
        <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6 space-y-4">
                {/* Заголовок */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-orange-900 mb-1">
                            Campaign Deadline Passed
                        </h3>
                        <p className="text-sm text-orange-700">
                            The campaign has ended. Update the status to finalize the result.
                        </p>
                    </div>
                </div>

                {/* Предсказание результата */}
                <div className={`p-4 rounded-lg border ${
                    willBeSuccessful
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {willBeSuccessful ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                            willBeSuccessful ? 'text-green-800' : 'text-red-800'
                        }`}>
                            Expected Result: {willBeSuccessful ? 'Successful' : 'Failed'}
                        </span>
                    </div>
                    <p className={`text-sm ${
                        willBeSuccessful ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {willBeSuccessful
                            ? 'The campaign reached its funding goal! Creator can withdraw funds.'
                            : 'The campaign did not reach its goal. Donors can request refunds.'
                        }
                    </p>
                </div>

                {/* Сообщения об ошибке/успехе */}
                {error && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                )}

                {/* Кнопка обновления */}
                <Button
                    onClick={handleUpdateStatus}
                    disabled={loading || !account}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Updating Status...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Finalize Campaign Status
                        </>
                    )}
                </Button>

                {!account && (
                    <p className="text-xs text-center text-gray-500">
                        Connect your wallet to update the campaign status
                    </p>
                )}

                {/* Информация */}
                <div className="text-xs text-gray-500 text-center">
                    Anyone can call this function to finalize the campaign status.
                    <br />
                    Gas fees will apply.
                </div>
            </CardContent>
        </Card>
    );
}

export default UpdateStatusButton;
