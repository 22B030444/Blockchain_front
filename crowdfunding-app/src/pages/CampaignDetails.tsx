// pages/CampaignDetails.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import { useCampaign } from '../hooks/useCampaign';
import { Campaign, CampaignState, CATEGORY_NAMES } from '../types/campaign';
import DonateForm from '../components/campaigns/DonateForm';
import MilestonesList from '../components/milestones/MilestonesList';
import RewardsList from '../components/rewards/RewardsList';
import { formatEther, formatDate, getDaysRemaining, getProgressPercentage, formatAddress } from '../utils/formatters';

function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { account, contract } = useContext(Web3Context);
    const campaignId = Number(id);
    const { campaign, loading, error } = useCampaign(campaignId);

    const [userDonation, setUserDonation] = useState<bigint>(0n);
    const [isDonor, setIsDonor] = useState(false);

    // Загрузка информации о донате пользователя
    useEffect(() => {
        const fetchUserDonation = async () => {
            if (!contract || !account || !campaign) return;

            try {
                const donation = await contract.getUserDonation(campaignId, account);
                setUserDonation(donation);
                setIsDonor(donation > 0n);
            } catch (err) {
                console.error('Ошибка загрузки доната:', err);
            }
        };

        fetchUserDonation();
    }, [contract, account, campaignId, campaign]);

    const handleRefresh = async () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2>Загрузка...</h2>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2 style={{ color: '#dc3545' }}>Кампания не найдена</h2>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Вернуться на главную
                </button>
            </div>
        );
    }

    const progress = getProgressPercentage(campaign.amountCollected, campaign.goal);
    const daysLeft = getDaysRemaining(campaign.deadline);
    const isCreator = account?.toLowerCase() === campaign.creator.toLowerCase();
    const isActive = campaign.state === CampaignState.ACTIVE;

    const getStateInfo = () => {
        switch (campaign.state) {
            case CampaignState.ACTIVE:
                return { text: 'Активна', color: '#28a745', bgColor: '#d4edda' };
            case CampaignState.SUCCESSFUL:
                return { text: 'Успешно завершена', color: '#17a2b8', bgColor: '#d1ecf1' };
            case CampaignState.FAILED:
                return { text: 'Провалена', color: '#dc3545', bgColor: '#f8d7da' };
            default:
                return { text: 'Неизвестно', color: '#6c757d', bgColor: '#e9ecef' };
        }
    };

    const stateInfo = getStateInfo();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Кнопка назад */}
            <button
                onClick={() => navigate('/')}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                ← Назад
            </button>

            {/* Основная информация */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Левая колонка */}
                <div>
                    {/* Изображение */}
                    <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                        }}
                    />

                    {/* Заголовок и статус */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <h1 style={{ margin: 0 }}>{campaign.title}</h1>
                            <span style={{
                                padding: '8px 15px',
                                backgroundColor: stateInfo.bgColor,
                                color: stateInfo.color,
                                borderRadius: '5px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>
                {stateInfo.text}
              </span>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '14px' }}>
                            <span>📁 {CATEGORY_NAMES[campaign.category]}</span>
                            <span>👤 Создатель: {formatAddress(campaign.creator)}</span>
                            {isCreator && (
                                <span style={{ color: '#007bff', fontWeight: 'bold' }}>✨ Вы создатель</span>
                            )}
                        </div>
                    </div>

                    {/* Описание */}
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        marginBottom: '20px'
                    }}>
                        <h3>📝 Описание</h3>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {campaign.description}
                        </p>
                    </div>

                    {/* Milestones */}
                    <MilestonesList
                        campaignId={campaignId}
                        milestones={campaign.milestones}
                        isCreator={isCreator}
                        isDonor={isDonor}
                        onUpdate={handleRefresh}
                    />

                    {/* Rewards */}
                    <RewardsList
                        rewards={campaign.rewards}
                        userDonation={userDonation}
                    />
                </div>

                {/* Правая колонка */}
                <div>
                    {/* Прогресс */}
                    <div style={{
                        padding: '25px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                                {formatEther(campaign.amountCollected)} ETH
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                                из {formatEther(campaign.goal)} ETH
                            </div>
                        </div>

                        {/* Прогресс бар */}
                        <div style={{
                            width: '100%',
                            height: '12px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: progress >= 100 ? '#28a745' : '#007bff',
                                transition: 'width 0.3s'
                            }} />
                        </div>

                        {/* Статистика */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            paddingTop: '15px',
                            borderTop: '1px solid #eee'
                        }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{progress}%</div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Собрано</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{campaign.donorsCount}</div>
                                <div style={{ color: '#666', fontSize: '14px' }}>Доноров</div>
                            </div>

                            {isActive && daysLeft > 0 ? (
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{daysLeft}</div>
                                    <div style={{ color: '#666', fontSize: '14px' }}>Дней осталось</div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatDate(campaign.deadline)}</div>
                                    <div style={{ color: '#666', fontSize: '14px' }}>Дедлайн</div>
                                </div>
                            )}

                            {campaign.averageRating > 0 && (
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                        {'⭐'.repeat(Math.round(campaign.averageRating))}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '14px' }}>
                                        {campaign.averageRating.toFixed(1)} рейтинг
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Форма доната */}
                    {isActive && !isCreator && (
                        <DonateForm campaignId={campaignId} onSuccess={handleRefresh} />
                    )}

                    {/* Информация о донате пользователя */}
                    {isDonor && (
                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#d1ecf1',
                            border: '1px solid #bee5eb',
                            borderRadius: '10px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>💙 Ваш донат</h4>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>
                                {formatEther(userDonation)} ETH
                            </div>
                        </div>
                    )}

                    {/* Информация для создателя */}
                    {isCreator && (
                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            borderRadius: '10px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>👤 Панель создателя</h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                Вы можете выводить средства по Milestones после их одобрения донорами.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CampaignDetails;


