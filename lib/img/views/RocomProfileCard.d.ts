import React from 'react';
type PetItem = {
    name: string;
    icon: string;
};
type Props = {
    data: {
        userName: string;
        userLevel: string;
        userUid: string;
        userAvatar: string;
        enrollDays: string;
        starName: string;
        hasAiProfileData: boolean;
        summaryTitleParts: string[];
        bestPetName: string;
        bestPetImage: string;
        scoreText: string;
        aiCommentText: string;
        currentCollectionCount: string;
        totalCollectionCount: string;
        amazingSpriteCount: string;
        shinySpriteCount: string;
        colorfulSpriteCount: string;
        fashionCollectionCount: string;
        itemCount: string;
        collectionHint: string;
        hasBattleData: boolean;
        tierBadgeUrl: string;
        totalMatch: string;
        totalWin: string;
        winRate: string;
        matchResult: 'win' | 'fail';
        leftTeamPets: PetItem[];
        rightTeamPets: PetItem[];
        opponentName: string;
        opponentAvatar: string;
        radarPolygons: string[];
        radarAreaPoints: string;
        radarDots: Array<{
            x: number;
            y: number;
            value: number;
            key: string;
        }>;
        radarValueBadges: Array<{
            value: string;
            x: number;
            y: number;
            width: number;
        }>;
        radarAxisLabels: Array<{
            name: string;
            x: number;
            y: number;
            anchor: string;
        }>;
    };
};
export default function RocomProfileCard({ data }: Props): React.JSX.Element;
export {};
