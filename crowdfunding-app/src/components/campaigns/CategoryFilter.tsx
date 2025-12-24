// components/campaigns/CategoryFilter.tsx
import { CampaignCategory, CATEGORY_NAMES } from '../../types/campaign';
import { Button } from '../ui/button';

interface CategoryFilterProps {
    selectedCategory: CampaignCategory | null;
    onSelectCategory: (category: CampaignCategory | null) => void;
}

function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    const categories = Object.entries(CATEGORY_NAMES).map(([key, value]) => ({
        id: Number(key) as CampaignCategory,
        name: value
    }));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter by category</h3>
            <div className="flex flex-wrap gap-3">
                <Button
                    onClick={() => onSelectCategory(null)}
                    variant={selectedCategory === null ? "default" : "outline"}
                    className={`rounded-full transition-all duration-200 ${
                        selectedCategory === null
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                            : 'hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                >
                    All
                </Button>

                {categories.map((category) => (
                    <Button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className={`rounded-full transition-all duration-200 ${
                            selectedCategory === category.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                : 'hover:border-indigo-600 hover:text-indigo-600'
                        }`}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;
