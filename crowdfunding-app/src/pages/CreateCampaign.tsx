// pages/CreateCampaign.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import { CampaignCategory, CATEGORY_NAMES } from '../types/campaign';
import { parseEther } from '../utils/formatters';
import { isValidAmount, isValidDeadline, isValidUrl } from '../utils/validators';

interface MilestoneInput {
    description: string;
    percentage: number;
}

interface RewardInput {
    title: string;
    description: string;
    minDonation: string;
    quantity: number;
}

function CreateCampaign() {
    const { contract, account } = useContext(Web3Context);
    const navigate = useNavigate();

    // Основные поля
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState<CampaignCategory>(CampaignCategory.TECHNOLOGY);

    // Milestones
    const [milestones, setMilestones] = useState<MilestoneInput[]>([
        { description: 'Стартовый капитал (автоматический вывод)', percentage: 30 }
    ]);

    // Rewards
    const [rewards, setRewards] = useState<RewardInput[]>([]);

    // Состояние
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Добавить milestone
    const addMilestone = () => {
        setMilestones([...milestones, { description: '', percentage: 0 }]);
    };

    // Удалить milestone (кроме первого)
    const removeMilestone = (index: number) => {
        if (index === 0) return; // Нельзя удалить Milestone 0
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    // Обновить milestone
    const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
        const updated = [...milestones];
        updated[index] = { ...updated[index], [field]: value };
        setMilestones(updated);
    };

    // Добавить reward
    const addReward = () => {
        setRewards([...rewards, { title: '', description: '', minDonation: '', quantity: 0 }]);
    };

    // Удалить reward
    const removeReward = (index: number) => {
        setRewards(rewards.filter((_, i) => i !== index));
    };

    // Обновить reward
    const updateReward = (index: number, field: keyof RewardInput, value: string | number) => {
        const updated = [...rewards];
        updated[index] = { ...updated[index], [field]: value };
        setRewards(updated);
    };

    // Валидация
    const validate = (): string | null => {
        if (!title.trim()) return 'Укажите название';
        if (!description.trim()) return 'Укажите описание';
        if (!imageUrl.trim() || !isValidUrl(imageUrl)) return 'Укажите корректный URL изображения';
        if (!isValidAmount(goal)) return 'Укажите корректную цель сбора';
        if (!deadline || !isValidDeadline(deadline)) return 'Укажите корректный дедлайн';

        // Проверка milestones
        const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage), 0);
        if (totalPercentage !== 100) return 'Сумма процентов milestones должна быть 100%';

        for (let i = 0; i < milestones.length; i++) {
            if (!milestones[i].description.trim()) return `Milestone ${i}: укажите описание`;
            if (milestones[i].percentage <= 0) return `Milestone ${i}: процент должен быть > 0`;
        }

        // Проверка rewards
        for (let i = 0; i < rewards.length; i++) {
            if (!rewards[i].title.trim()) return `Reward ${i + 1}: укажите название`;
            if (!isValidAmount(rewards[i].minDonation)) return `Reward ${i + 1}: укажите корректную минимальную сумму`;
        }

        return null;
    };

    // Создание кампании
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contract || !account) {
            setError('Подключите кошелек');
            return;
        }

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Конвертируем дедлайн в timestamp
            const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

            // Подготовка milestones
            const milestonesData = milestones.map(m => ({
                description: m.description,
                percentage: m.percentage
            }));

            // Подготовка rewards
            const rewardsData = rewards.map(r => ({
                title: r.title,
                description: r.description,
                minDonation: parseEther(r.minDonation),
                quantity: r.quantity
            }));

            // Вызов контракта
            const tx = await contract.createCampaign(
                title,
                description,
                imageUrl,
                parseEther(goal),
                deadlineTimestamp,
                category,
                milestonesData,
                rewardsData
            );

            console.log('Транзакция отправлена:', tx.hash);
            await tx.wait();
            console.log('Кампания создана!');

            // Переход на страницу кампаний
            navigate('/');
        } catch (err: any) {
            console.error('Ошибка создания кампании:', err);
            setError(err.message || 'Ошибка создания кампании');
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Подключите кошелек для создания кампании</h2>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Создать кампанию</h1>

            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Основная информация */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Название *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название вашей кампании"
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Описание *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Подробное описание вашего проекта"
                        rows={6}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        URL изображения *
                    </label>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Цель сбора (ETH) *
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="10"
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Дедлайн *
                        </label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Категория *
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(Number(e.target.value) as CampaignCategory)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    >
                        {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>

                {/* Milestones */}
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <h3>Milestones (этапы финансирования)</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                        <strong>Milestone 0</strong> - стартовый капитал, выводится автоматически при успешном сборе.<br/>
                        <strong>Milestone 1+</strong> - требуют одобрения доноров через голосование.
                    </p>

                    {milestones.map((milestone, index) => (
                        <div key={index} style={{
                            marginBottom: '15px',
                            padding: '15px',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            border: index === 0 ? '2px solid #28a745' : '1px solid #ddd'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Milestone {index} {index === 0 ? '(Автоматический)' : '(Голосование)'}</strong>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMilestone(index)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>

                            <input
                                type="text"
                                value={milestone.description}
                                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                placeholder="Описание этапа"
                                disabled={index === 0}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    marginBottom: '10px',
                                    backgroundColor: index === 0 ? '#e9ecef' : 'white'
                                }}
                            />

                            <div>
                                <label style={{ marginRight: '10px' }}>Процент от цели:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={milestone.percentage}
                                    onChange={(e) => updateMilestone(index, 'percentage', Number(e.target.value))}
                                    style={{ width: '80px', padding: '5px' }}
                                />
                                <span style={{ marginLeft: '5px' }}>%</span>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addMilestone}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        + Добавить milestone
                    </button>

                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        Всего: {milestones.reduce((sum, m) => sum + Number(m.percentage), 0)}%
                        {milestones.reduce((sum, m) => sum + Number(m.percentage), 0) !== 100 && (
                            <span style={{ color: '#dc3545', marginLeft: '10px' }}>
                (должно быть 100%)
              </span>
                        )}
                    </div>
                </div>

                {/* Rewards */}
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <h3>Rewards (награды для доноров)</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                        Необязательно. Можно предложить донорам награды за определенный уровень пожертвования.
                    </p>

                    {rewards.map((reward, index) => (
                        <div key={index} style={{
                            marginBottom: '15px',
                            padding: '15px',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Reward {index + 1}</strong>
                                <button
                                    type="button"
                                    onClick={() => removeReward(index)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>

                            <input
                                type="text"
                                value={reward.title}
                                onChange={(e) => updateReward(index, 'title', e.target.value)}
                                placeholder="Название награды"
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />

                            <textarea
                                value={reward.description}
                                onChange={(e) => updateReward(index, 'description', e.target.value)}
                                placeholder="Описание награды"
                                rows={3}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Мин. донат (ETH):</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={reward.minDonation}
                                        onChange={(e) => updateReward(index, 'minDonation', e.target.value)}
                                        placeholder="0.1"
                                        style={{ width: '100%', padding: '8px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Количество (0 = неограничено):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reward.quantity}
                                        onChange={(e) => updateReward(index, 'quantity', Number(e.target.value))}
                                        style={{ width: '100%', padding: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addReward}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        + Добавить reward
                    </button>
                </div>

                {/* Кнопка создания */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Создание...' : 'Создать кампанию'}
                </button>
            </form>
        </div>
    );
}

export default CreateCampaign;