// components/campaigns/DonateForm.tsx
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Campaign, CampaignState } from '../../types/campaign';
import { parseEther } from '../../utils/formatters';
import { isValidAmount } from '../../utils/validators';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AlertCircle, Wallet, Heart, Loader2, CheckCircle } from 'lucide-react';

interface DonateFormProps {
    campaignId: number;
    campaign: Campaign;
    onSuccess: () => void;
}

function DonateForm({ campaignId, campaign, onSuccess }: DonateFormProps) {
    const { contract, account } = useWeb3();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isActive = campaign.state === CampaignState.Active;

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contract || !account) {
            setError('Подключите кошелек');
            return;
        }

        if (!isValidAmount(amount)) {
            setError('Укажите корректную сумму');
            return;
        }

        const donationValue = parseFloat(amount);
        if (donationValue <= 0 || donationValue > 100) {
            setError('Сумма доната должна быть от 0.001 до 100 ETH');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const tx = await contract.donate(campaignId, {
                value: parseEther(amount)
            });

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Донат успешен!');

            setAmount('');
            onSuccess();
        } catch (err: any) {
            console.error('Ошибка доната:', err);
            setError(err.message || 'Ошибка при отправке доната');
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Требуется подключение</h3>
                        <p className="text-sm text-gray-600">
                            Подключите кошелек для поддержки проекта
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isActive) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Кампания завершена</h3>
                        <p className="text-sm text-gray-600">
                            Донаты больше не принимаются
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-indigo-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Поддержать проект
                </CardTitle>
                <CardDescription>
                    Помогите достичь цели этой кампании
                </CardDescription>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Сумма доната (ETH)
                        </label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.1"
                                className="text-lg pr-16"
                                required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                ETH
                            </span>
                        </div>

                        {/* Быстрый выбор суммы */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {['0.01', '0.1', '1'].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    {preset} ETH
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="ghost"
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Отправка...
                            </>
                        ) : (
                            <>
                                <Heart className="w-5 h-5 mr-2" />
                                Задонатить
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        Средства будут отправлены через смарт-контракт Ethereum
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default DonateForm;
