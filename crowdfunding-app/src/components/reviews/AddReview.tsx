// components/reviews/AddReview.tsx
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Campaign, CampaignState } from '../../types/campaign';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AlertCircle, Loader2, Star, MessageSquare } from 'lucide-react';

interface AddReviewProps {
    campaignId: number;
    campaign: Campaign;
    isDonor: boolean;
    hasReviewed: boolean;
    onSuccess: () => void;
}

function AddReview({ campaignId, campaign, isDonor, hasReviewed, onSuccess }: AddReviewProps) {
    const { contract, account } = useWeb3();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const canReview =
        isDonor &&
        !hasReviewed &&
        (campaign.state === CampaignState.Successful ||
            campaign.state === CampaignState.Completed ||
            campaign.state === CampaignState.Failed);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contract || !account) {
            setError('Connect your wallet');
            return;
        }

        if (rating === 0) {
            setError('Select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Write a comment');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const tx = await contract.addReview(
                campaignId,
                rating,
                comment
            );

            console.log('Transaction sent:', tx.hash);
            await tx.wait();
            console.log('Review added!');

            setRating(0);
            setComment('');
            onSuccess();
        } catch (err: any) {
            console.error('Error adding review:', err);
            setError(err.reason || err.message || 'Error adding review');
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Connection required</h3>
                        <p className="text-sm text-gray-600">
                            Connect your wallet to leave a review
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!canReview) {
        if (hasReviewed) {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">You have already left a review</h3>
                            <p className="text-sm text-gray-600">
                                Thank you for your opinion!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (!isDonor) {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">For donors only</h3>
                            <p className="text-sm text-gray-600">
                                Support the project to leave a review
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (campaign.state === CampaignState.Active) {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Campaign active</h3>
                            <p className="text-sm text-gray-600">
                                Feedback can be left after the campaign ends.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }
    }

    return (
        <Card className="border-2 border-indigo-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Leave feedback
                </CardTitle>
                <CardDescription>
                    Share your experience of participating in this campaign
                </CardDescription>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Рейтинг */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your rating *
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoveredRating(value)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${
                                            value <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm text-gray-600 font-medium">
                                    {rating === 1 && 'Bad'}
                                    {rating === 2 && 'Unsatisfactory'}
                                    {rating === 3 && 'Normal'}
                                    {rating === 4 && 'Fine'}
                                    {rating === 5 && 'Great'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Комментарий */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Комментарий *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe your experience participating in this campaign..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            required
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {comment.length}/500
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || rating === 0}
                        className="w-full"
                        variant="default"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Leave feedback
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        The review will be saved on the blockchain and will be visible to everyone.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default AddReview;