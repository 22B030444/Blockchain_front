// components/campaigns/DonateForm.tsx
import React, { useState, useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { parseEther, formatEther } from '../../utils/formatters';
import { isValidAmount } from '../../utils/validators';

interface DonateFormProps {
    campaignId: number;
    onSuccess: () => void;
}

function DonateForm({ campaignId, onSuccess }: DonateFormProps) {
    const { contract, account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                textAlign: 'center'
            }}>
                <p>Подключите кошелек для доната</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '25px',
            backgroundColor: 'white',
            border: '2px solid #007bff',
            borderRadius: '10px'
        }}>
            <h3 style={{ marginTop: 0 }}>💰 Сделать донат</h3>

            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleDonate}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Сумма (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.1"
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '18px',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Отправка...' : 'Задонатить'}
                </button>
            </form>
        </div>
    );
}

export default DonateForm;


