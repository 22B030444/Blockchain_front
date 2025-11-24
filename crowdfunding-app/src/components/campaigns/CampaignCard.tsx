// components/campaigns/CampaignCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign, CATEGORY_NAMES, CampaignState } from '../../types/campaign';
import { formatEther, formatDate, getDaysRemaining, getProgressPercentage } from '../../utils/formatters';

interface CampaignCardProps {
    campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
    const navigate = useNavigate();
    const progress = getProgressPercentage(campaign.amountCollected, campaign.goal);
    const daysLeft = getDaysRemaining(campaign.deadline);
    const isActive = campaign.state === CampaignState.ACTIVE;

    const getStateLabel = () => {
        switch (campaign.state) {
            case CampaignState.ACTIVE:
                return { text: 'Активна', color: '#28a745' };
            case CampaignState.SUCCESSFUL:
                return { text: 'Успешна', color: '#17a2b8' };
            case CampaignState.FAILED:
                return { text: 'Провалена', color: '#dc3545' };
            default:
                return { text: 'Неизвестно', color: '#6c757d' };
        }
    };

    const stateLabel = getStateLabel();

    return (
        <div
            onClick={() => navigate(`/campaign/${campaign.id}`)}
            style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Изображение */}
            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#f0f0f0' }}>
                <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                />

                {/* Категория */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px'
                }}>
                    {CATEGORY_NAMES[campaign.category]}
                </div>

                {/* Статус */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: stateLabel.color,
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
                    {stateLabel.text}
                </div>
            </div>

            {/* Контент */}
            <div style={{ padding: '15px' }}>
                {/* Заголовок */}
                <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {campaign.title}
                </h3>

                {/* Описание */}
                <p style={{
                    margin: '0 0 15px 0',
                    color: '#666',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {campaign.description}
                </p>

                {/* Прогресс бар */}
                <div style={{ marginBottom: '10px' }}>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: progress >= 100 ? '#28a745' : '#007bff',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>

                {/* Статистика */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px'
                }}>
                    <div>
                        <strong style={{ fontSize: '16px', color: '#007bff' }}>
                            {formatEther(campaign.amountCollected)} ETH
                        </strong>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                            из {formatEther(campaign.goal)} ETH
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '16px' }}>{progress}%</strong>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                            собрано
                        </div>
                    </div>
                </div>

                {/* Дополнительная информация */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid #eee',
                    fontSize: '13px',
                    color: '#666'
                }}>
                    <div>
                        👥 {campaign.donorsCount} {campaign.donorsCount === 1 ? 'донор' : 'доноров'}
                    </div>

                    {isActive && daysLeft > 0 ? (
                        <div>
                            ⏰ {daysLeft} {daysLeft === 1 ? 'день' : 'дней'}
                        </div>
                    ) : (
                        <div>
                            📅 {formatDate(campaign.deadline)}
                        </div>
                    )}
                </div>

                {/* Рейтинг */}
                {campaign.averageRating > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                        {'⭐'.repeat(Math.round(campaign.averageRating))}
                        <span style={{ marginLeft: '5px', color: '#666' }}>
              {campaign.averageRating.toFixed(1)}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CampaignCard;


