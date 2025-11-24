// components/milestones/MilestonesList.tsx
import React, { useContext, useState } from 'react';
import { Web3Context } from '../../contexts/Web3Context';
import { Milestone } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';

interface MilestonesListProps {
    campaignId: number;
    milestones: Milestone[];
    isCreator: boolean;
    isDonor: boolean;
    onUpdate: () => void;
}

function MilestonesList({ campaignId, milestones, isCreator, isDonor, onUpdate }: MilestonesListProps) {
    const { contract } = useContext(Web3Context);
    const [loading, setLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Голосование за milestone
    const handleVote = async (milestoneId: number, voteFor: boolean) => {
        if (!contract) return;

        try {
            setLoading(milestoneId);
            setError(null);

            const tx = await contract.voteForMilestone(campaignId, milestoneId, voteFor);
            await tx.wait();

            onUpdate();
        } catch (err: any) {
            console.error('Ошибка голосования:', err);
            setError(err.message || 'Ошибка голосования');
        } finally {
            setLoading(null);
        }
    };

    // Вывод средств по milestone
    const handleWithdraw = async (milestoneId: number) => {
        if (!contract) return;

        try {
            setLoading(milestoneId);
            setError(null);

            const tx = await contract.withdrawMilestone(campaignId, milestoneId);
            await tx.wait();

            onUpdate();
        } catch (err: any) {
            console.error('Ошибка вывода:', err);
            setError(err.message || 'Ошибка вывода средств');
        } finally {
            setLoading(null);
        }
    };

    if (milestones.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '30px' }}>
            <h2>📊 Milestones</h2>

            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {milestones.map((milestone, index) => {
                    const totalVotes = milestone.votesFor + milestone.votesAgainst;
                    const approvalRate = totalVotes > 0
                        ? Math.round((milestone.votesFor / totalVotes) * 100)
                        : 0;
                    const isAutomatic = index === 0;

                    return (
                        <div
                            key={milestone.id}
                            style={{
                                padding: '20px',
                                border: '2px solid',
                                borderColor: milestone.isCompleted ? '#28a745' : isAutomatic ? '#17a2b8' : '#ddd',
                                borderRadius: '10px',
                                backgroundColor: milestone.isCompleted ? '#d4edda' : 'white'
                            }}
                        >
                            {/* Заголовок */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        Milestone {index}
                                        {isAutomatic && (
                                            <span style={{
                                                fontSize: '12px',
                                                backgroundColor: '#17a2b8',
                                                color: 'white',
                                                padding: '3px 8px',
                                                borderRadius: '12px'
                                            }}>
                        Автоматический
                      </span>
                                        )}
                                        {!isAutomatic && milestone.isApproved && (
                                            <span style={{
                                                fontSize: '12px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                padding: '3px 8px',
                                                borderRadius: '12px'
                                            }}>
                        Одобрен
                      </span>
                                        )}
                                    </h3>
                                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                        {milestone.description}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                                        {formatEther(milestone.amount)} ETH
                                    </div>
                                    {milestone.isCompleted && (
                                        <div style={{ color: '#28a745', fontSize: '14px', marginTop: '5px' }}>
                                            ✅ Выведено
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Информация о голосовании (только для milestone 1+) */}
                            {!isAutomatic && !milestone.isCompleted && (
                                <div style={{ marginTop: '15px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '10px',
                                        fontSize: '14px'
                                    }}>
                                        <span>👍 За: {milestone.votesFor}</span>
                                        <span>👎 Против: {milestone.votesAgainst}</span>
                                        <span>📊 Одобрение: {approvalRate}%</span>
                                    </div>

                                    {/* Прогресс бар голосования */}
                                    <div style={{
                                        width: '100%',
                                        height: '10px',
                                        backgroundColor: '#e9ecef',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            width: `${approvalRate}%`,
                                            height: '100%',
                                            backgroundColor: approvalRate >= 50 ? '#28a745' : '#dc3545',
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>

                                    {/* Кнопки голосования для доноров */}
                                    {isDonor && !milestone.isApproved && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleVote(milestone.id, true)}
                                                disabled={loading === milestone.id}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: loading === milestone.id ? 'not-allowed' : 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                👍 За
                                            </button>
                                            <button
                                                onClick={() => handleVote(milestone.id, false)}
                                                disabled={loading === milestone.id}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: loading === milestone.id ? 'not-allowed' : 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                👎 Против
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Кнопка вывода для создателя */}
                            {isCreator && !milestone.isCompleted && (
                                <div style={{ marginTop: '15px' }}>
                                    {(isAutomatic || milestone.isApproved) ? (
                                        <button
                                            onClick={() => handleWithdraw(milestone.id)}
                                            disabled={loading === milestone.id}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: loading === milestone.id ? '#6c757d' : '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: loading === milestone.id ? 'not-allowed' : 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {loading === milestone.id ? 'Обработка...' : '💰 Вывести средства'}
                                        </button>
                                    ) : (
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: '#fff3cd',
                                            color: '#856404',
                                            borderRadius: '5px',
                                            textAlign: 'center',
                                            fontSize: '14px'
                                        }}>
                                            ⏳ Ожидание одобрения доноров
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MilestonesList;


