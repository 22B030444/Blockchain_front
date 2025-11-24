// pages/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCategory } from '../types/campaign';
import CampaignCard from '../components/campaigns/CampaignCard';
import CategoryFilter from '../components/campaigns/CategoryFilter';

function Home() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | null>(null);
    const { campaigns, loading, error } = useCampaigns(selectedCategory ?? undefined);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2>Загрузка кампаний...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <h2 style={{ color: '#dc3545' }}>Ошибка загрузки</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Баннер */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '60px 40px',
                borderRadius: '15px',
                color: 'white',
                marginBottom: '40px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
                    🚀 Crowdfunding Platform
                </h1>
                <p style={{ fontSize: '20px', margin: '0 0 30px 0', opacity: 0.9 }}>
                    Инвестируйте в будущее. Поддержите инновационные проекты на блокчейне.
                </p>
                <button
                    onClick={() => navigate('/create')}
                    style={{
                        padding: '15px 40px',
                        fontSize: '18px',
                        backgroundColor: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Создать кампанию
                </button>
            </div>

            {/* Статистика */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div style={{
                    padding: '25px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
                        {campaigns.length}
                    </div>
                    <div style={{ color: '#666', marginTop: '5px' }}>Кампаний</div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                        {campaigns.filter(c => c.state === 1).length}
                    </div>
                    <div style={{ color: '#666', marginTop: '5px' }}>Успешных</div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
                        {campaigns.filter(c => c.state === 0).length}
                    </div>
                    <div style={{ color: '#666', marginTop: '5px' }}>Активных</div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#17a2b8' }}>
                        {campaigns.reduce((sum, c) => sum + c.donorsCount, 0)}
                    </div>
                    <div style={{ color: '#666', marginTop: '5px' }}>Доноров</div>
                </div>
            </div>

            {/* Фильтр по категориям */}
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Список кампаний */}
            {campaigns.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px'
                }}>
                    <h2 style={{ color: '#666' }}>Пока нет кампаний</h2>
                    <p style={{ color: '#999' }}>
                        {selectedCategory !== null
                            ? 'В этой категории пока нет кампаний'
                            : 'Будьте первым, кто создаст кампанию!'}
                    </p>
                    <button
                        onClick={() => navigate('/create')}
                        style={{
                            marginTop: '20px',
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Создать кампанию
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '25px'
                }}>
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;


