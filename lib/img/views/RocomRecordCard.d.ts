import React from 'react';
type BattleCard = {
    leftName: string;
    leftAvatar: string;
    leftPets: Array<{
        name: string;
        icon: string;
    }>;
    rightName: string;
    rightAvatar: string;
    rightPets: Array<{
        name: string;
        icon: string;
    }>;
    resultLabel: string;
    resultKind: 'win' | 'lose';
    time: string;
    date: string;
};
type Props = {
    data: {
        userName: string;
        userLevel: string;
        userUid: string;
        userAvatar: string;
        winRate: string;
        totalMatch: string;
        currentPage: number;
        pageText: string;
        footerCommandHint: string;
        battles: BattleCard[];
    };
};
export default function RocomRecordCard({ data }: Props): React.JSX.Element;
export {};
