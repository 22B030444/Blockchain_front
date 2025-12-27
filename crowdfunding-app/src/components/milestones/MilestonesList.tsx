// components/milestones/MilestonesList.tsx
import { Milestone, CampaignState } from '../../types/campaign';
import MilestoneCard from './MilestoneCard';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import {
    Flag,
    Target,
    CheckCircle,
    Info
} from 'lucide-react';

interface MilestonesListProps {
    campaignId: number;
    milestones: Milestone[];
    campaignState: CampaignState;
    isCreator: boolean;
    isDonor: boolean;
    onUpdate: () => void;
}

function MilestonesList({
                            campaignId,
                            milestones,
                            campaignState,
                            isCreator,
                            isDonor,
                            onUpdate
                        }: MilestonesListProps) {
    if (milestones.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <Flag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No milestones set for this campaign</p>
                <p className="text-sm mt-1">
                    Creator can withdraw all funds at once after success
                </p>
            </div>
        );
    }

    const campaignSuccessful = campaignState === CampaignState.Successful ||
        campaignState === CampaignState.Completed;

    // Статистика
    const completedCount = milestones.filter(m => m.completed).length;
    const approvedCount = milestones.filter(m => m.approved).length;
    const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
    const completedPercentage = milestones
        .filter(m => m.completed)
        .reduce((sum, m) => sum + m.percentage, 0);

    return (
        <div className="space-y-6">
            {/* Header with Progress */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-500" />
                        Project Milestones
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {completedCount} / {milestones.length} completed
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Funds Released</span>
                        <span className="font-medium">{completedPercentage}% of {totalPercentage}%</span>
                    </div>
                    <Progress
                        value={totalPercentage > 0 ? (completedPercentage / totalPercentage) * 100 : 0}
                        className="h-2"
                    />
                </div>

                {/* Info for donors */}
                {isDonor && !campaignSuccessful && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Milestone voting will be available after the campaign succeeds</p>
                                    <p className="mt-1 text-blue-600">
                                        As a donor, you'll be able to vote on milestone completion to release funds to the creator.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Info about first milestone */}
                {campaignSuccessful && milestones.length > 0 && !milestones[0].completed && isCreator && (
                    <Card className="border-purple-200 bg-purple-50">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-purple-800">
                                    <p className="font-medium">First milestone is available immediately!</p>
                                    <p className="mt-1 text-purple-600">
                                        You can withdraw the first {milestones[0].percentage}% without donor approval as initial funding.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
                {milestones.map((milestone, index) => (
                    <MilestoneCard
                        key={index}
                        campaignId={campaignId}
                        milestoneIndex={index}
                        milestone={milestone}
                        isCreator={isCreator}
                        isDonor={isDonor}
                        campaignSuccessful={campaignSuccessful}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-4 border-t">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-purple-200" />
                    <span>Initial (no vote required)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-200" />
                    <span>Pending vote</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-200" />
                    <span>Approved</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-200" />
                    <span>Completed</span>
                </div>
            </div>
        </div>
    );
}

export default MilestonesList;
