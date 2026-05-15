import React from 'react';
type PetCard = {
    name: string;
    level: string;
    types: string;
    rarity: string;
    imageUrl: string;
};
type Props = {
    data: {
        currentTab: string;
        userName: string;
        userLevel: string;
        userUid: string;
        totalCount: number;
        currentPage: number;
        totalPages: number;
        accountLabel: string;
        pets: PetCard[];
        pageSize: number;
    };
};
export default function RocomPetPackageCard({ data }: Props): React.JSX.Element;
export {};
