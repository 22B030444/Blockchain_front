export const CROWDFUNDING_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_percentage",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_durationDays",
                "type": "uint256"
            }
        ],
        "name": "addMilestone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_rating",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_comment",
                "type": "string"
            }
        ],
        "name": "addReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minAmount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_maxQuantity",
                "type": "uint256"
            }
        ],
        "name": "addReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "CampaignCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum Crowdfunding.CampaignStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "name": "CampaignStatusUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_imageHash",
                "type": "string"
            },
            {
                "internalType": "enum Crowdfunding.Category",
                "name": "_category",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_durationDays",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minDonation",
                "type": "uint256"
            }
        ],
        "name": "createCampaign",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneIndex",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "MilestoneAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneIndex",
                "type": "uint256"
            }
        ],
        "name": "MilestoneApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneIndex",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "MilestoneVoted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RefundIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "reviewer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rating",
                "type": "uint256"
            }
        ],
        "name": "ReviewAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            }
        ],
        "name": "RewardAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            }
        ],
        "name": "RewardClaimed",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "updateCampaignStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_milestoneIndex",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_approve",
                "type": "bool"
            }
        ],
        "name": "voteForMilestone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_milestoneIndex",
                "type": "uint256"
            }
        ],
        "name": "withdrawMilestone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "campaignCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaignDonations",
        "outputs": [
            {
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaignMilestones",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "percentage",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "targetDate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "votesFor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "votesAgainst",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaignReviews",
        "outputs": [
            {
                "internalType": "address",
                "name": "reviewer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "rating",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "comment",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaignRewards",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "maxQuantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaigns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "imageHash",
                "type": "string"
            },
            {
                "internalType": "enum Crowdfunding.Category",
                "name": "category",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minDonation",
                "type": "uint256"
            },
            {
                "internalType": "enum Crowdfunding.CampaignStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "fundsWithdrawn",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalDonors",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "donorContributions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllCampaigns",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "imageHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum Crowdfunding.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minDonation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum Crowdfunding.CampaignStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsWithdrawn",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDonors",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Campaign[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getAverageRating",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaign",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "imageHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum Crowdfunding.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minDonation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum Crowdfunding.CampaignStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsWithdrawn",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDonors",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Campaign",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaignDonations",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "donor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Donation[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaignMilestones",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "percentage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "targetDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votesFor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votesAgainst",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Milestone[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaignReviews",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "reviewer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rating",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "comment",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Review[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaignRewards",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "minAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxQuantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "claimed",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Reward[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Crowdfunding.Category",
                "name": "_category",
                "type": "uint8"
            }
        ],
        "name": "getCampaignsByCategory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "imageHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum Crowdfunding.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minDonation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum Crowdfunding.CampaignStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsWithdrawn",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDonors",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Campaign[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Crowdfunding.Category",
                "name": "_category",
                "type": "uint8"
            }
        ],
        "name": "getCategoryStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "campaignCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "successCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaisedInCategory",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_donor",
                "type": "address"
            }
        ],
        "name": "getDonorContribution",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPlatformStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_totalCampaigns",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_activeCampaigns",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_successfulCampaigns",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalRaised",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_limit",
                "type": "uint256"
            }
        ],
        "name": "getTopCampaigns",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "imageHash",
                        "type": "string"
                    },
                    {
                        "internalType": "enum Crowdfunding.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minDonation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum Crowdfunding.CampaignStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsWithdrawn",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDonors",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Crowdfunding.Campaign[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasReviewed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "milestoneVotes",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "successfulCampaigns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCampaigns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalRaised",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]



export const CONTRACT_ADDRESS = "0x5bEfD4E1d52F69e848c6bf6Bf50D9c4289eba95D";