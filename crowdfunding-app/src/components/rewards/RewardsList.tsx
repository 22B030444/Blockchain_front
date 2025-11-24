// components/rewards/RewardsList.tsx
import React from 'react';
import { Reward } from '../../types/campaign';
import { formatEther } from '../../utils/formatters';

interface RewardsListProps {
    rewards: Reward[];
    userDonation?: bigint;
}

function RewardsList({ rewards, userDonation = 0n }: RewardsListProps) {
    if (rewards.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '30px' }}>
            <h2>🎁 Rewards (Награды)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {rewards.map((reward) => {
                    const isAvailable = reward.totalQuantity === 0 || reward.claimedQuantity < reward.totalQuantity;
                    const isEligible = userDonation >= reward.minDonation;

                    return (
                        <div
                            key={reward.id}
                            style={{
                                padding: '20px',
                                border: '2px solid',
                                borderColor: isEligible ? '#28a745' : '#ddd',
                                borderRadius: '10px',
                                backgroundColor: isEligible ? '#d4edda' : 'white',
                                opacity: isAvailable ? 1 : 0.6
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 10px 0' }}>
                                        {reward.title}
                                        {isEligible && (
                                            <span style={{
                                                marginLeft: '10px',
                                                fontSize: '12px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                padding: '3px 8px',
                                                borderRadius: '12px'
                                            }}>
                        ✅ Доступно вам
                      </span>
                                        )}
                                    </h3>
                                    <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                                        {reward.description}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        gap: '20px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        <div>
                                            <strong>Мин. донат:</strong> {formatEther(reward.minDonation)} ETH
                                        </div>
                                        {reward.totalQuantity > 0 && (
                                            <div>
                                                <strong>Осталось:</strong> {reward.totalQuantity - reward.claimedQuantity} / {reward.totalQuantity}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!isAvailable && (
                                    <div style={{
                                        padding: '8px 15px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        Закончились
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RewardsList;


