// components/reviews/ReviewsList.tsx
import { Review } from '../../types/campaign';
import {formatAddress, formatDate} from '../../utils/formatters';
import { Card, CardContent } from '../ui/card';
import { Star, User, MessageSquare } from 'lucide-react';


interface ReviewsListProps {
    reviews: Review[];
}

function ReviewsList({ reviews }: ReviewsListProps) {
    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Отзывов пока нет
                        </h3>
                        <p className="text-sm text-gray-500">
                            Станьте первым, кто оставит отзыв об этой кампании
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Группируем по рейтингу для статистики
    const ratingCounts = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const totalReviews = reviews.length;

    return (
        <div className="space-y-6">
            {/* Статистика рейтингов */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Средний рейтинг */}
                        <div className="text-center">
                            <div className="text-5xl font-bold text-indigo-600 mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <Star
                                        key={value}
                                        className={`w-6 h-6 ${
                                            value <= Math.round(averageRating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">
                                На основе {totalReviews} {totalReviews === 1 ? 'отзыва' : 'отзывов'}
                            </p>
                        </div>

                        {/* Распределение оценок */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingCounts[rating] || 0;
                                const percentage = (count / totalReviews) * 100;

                                return (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 w-8">
                                            {rating}★
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Список отзывов */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Все отзывы ({totalReviews})
                </h3>

                {reviews.map((review, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                {/* Аватар */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Контент отзыва */}
                                <div className="flex-1 min-w-0">
                                    {/* Заголовок */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {formatAddress(review.reviewer)}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {/* Звезды */}
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <Star
                                                            key={value}
                                                            className={`w-4 h-4 ${
                                                                value <= review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                {/* Дата */}
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(review.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Комментарий */}
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ReviewsList;