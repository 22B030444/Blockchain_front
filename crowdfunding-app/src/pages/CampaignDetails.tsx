// pages/CampaignDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

function CampaignDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Детали кампании #{id}</h1>
        </div>
    );
}

export default CampaignDetails;