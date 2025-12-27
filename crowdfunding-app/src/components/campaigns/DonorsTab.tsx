// components/campaigns/DonorsTab.tsx
import { useEffect, useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { formatEther, formatDate, formatAddress } from '../../utils/formatters';
import { Users, TrendingUp, Wallet, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface Donation {
    donor: string;
    amount: bigint;
    timestamp: bigint;
}

interface DonorsTabProps {
    campaignId: number;
}

export default function DonorsTab({ campaignId }: DonorsTabProps) {
    const { contract } = useWeb3();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'recent' | 'amount' | 'oldest'>('recent');

    useEffect(() => {
        fetchDonations();
    }, [campaignId, contract]);

    const fetchDonations = async () => {
        if (!contract) return;

        try {
            setLoading(true);
            setError(null);

            const donationsData = await contract.getCampaignDonations(campaignId);
            setDonations(donationsData);
        } catch (err) {
            console.error('Error fetching donations:', err);
            setError('Failed to load donations');
        } finally {
            setLoading(false);
        }
    };

    const getSortedDonations = () => {
        const sorted = [...donations];

        switch (sortBy) {
            case 'amount':
                return sorted.sort((a, b) => Number(b.amount - a.amount));
            case 'oldest':
                return sorted.sort((a, b) => Number(a.timestamp - b.timestamp));
            case 'recent':
            default:
                return sorted.sort((a, b) => Number(b.timestamp - a.timestamp));
        }
    };

    const getTotalDonated = () => {
        return donations.reduce((sum, d) => sum + d.amount, 0n);
    };

    const getUniqueDonors = () => {
        const uniqueAddresses = new Set(donations.map(d => d.donor.toLowerCase()));
        return uniqueAddresses.size;
    };

    const formatTimestamp = (timestamp: bigint) => {
        return formatDate(Number(timestamp));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDonations}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donors Yet</h3>
                <p className="text-gray-600">Be the first to support this campaign!</p>
            </div>
        );
    }

    const sortedDonations = getSortedDonations();

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 mb-1">Total Donations</p>
                                <p className="text-3xl font-bold text-blue-900">{donations.length}</p>
                            </div>
                            <div className="p-3 bg-blue-200 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 mb-1">Unique Donors</p>
                                <p className="text-3xl font-bold text-green-900">{getUniqueDonors()}</p>
                            </div>
                            <div className="p-3 bg-green-200 rounded-lg">
                                <Users className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-purple-900">{formatEther(getTotalDonated())} ETH</p>
                            </div>
                            <div className="p-3 bg-purple-200 rounded-lg">
                                <Wallet className="w-6 h-6 text-purple-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Donation History</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'amount' | 'oldest')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                    <option value="recent">Most Recent</option>
                    <option value="amount">Highest Amount</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Donations List */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Donor Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {sortedDonations.map((donation, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">
                                                        {donation.donor.slice(2, 4).toUpperCase()}
                                                    </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`https://etherscan.io/address/${donation.donor}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                                    title={donation.donor}
                                                >
                                                    {formatAddress(donation.donor)}
                                                </a>
                                                <ExternalLink className="w-3 h-3 text-gray-400" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-semibold">
                                            {formatEther(donation.amount)} ETH
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatTimestamp(donation.timestamp)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}