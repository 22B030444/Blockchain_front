// components/campaigns/CategoryFilter.tsx
import React from 'react';
import { CampaignCategory, CATEGORY_NAMES } from '../../types/campaign';

interface CategoryFilterProps {
    selectedCategory: CampaignCategory | null;
    onSelectCategory: (category: CampaignCategory | null) => void;
}

function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Категории</h3>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => onSelectCategory(null)}
                    style={{
                        padding: '10px 20px',
                        border: '2px solid',
                        borderColor: selectedCategory === null ? '#007bff' : '#ddd',
                        backgroundColor: selectedCategory === null ? '#007bff' : 'white',
                        color: selectedCategory === null ? 'white' : '#333',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: selectedCategory === null ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                    }}
                >
                    Все
                </button>

                {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => onSelectCategory(Number(key) as CampaignCategory)}
                        style={{
                            padding: '10px 20px',
                            border: '2px solid',
                            borderColor: selectedCategory === Number(key) ? '#007bff' : '#ddd',
                            backgroundColor: selectedCategory === Number(key) ? '#007bff' : 'white',
                            color: selectedCategory === Number(key) ? 'white' : '#333',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: selectedCategory === Number(key) ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;


