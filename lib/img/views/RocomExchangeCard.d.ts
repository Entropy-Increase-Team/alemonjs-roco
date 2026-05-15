import React from 'react';
type Poster = {
    userName: string;
    userLevel: number;
    isOnline: boolean;
    userId: string;
    wantText: string;
    provideItems: string[];
    timeLabel: string;
    isExpired: boolean;
    avatarUrl: string;
};
type Props = {
    data: {
        pageNo: number;
        totalPages: number;
        refresh: boolean;
        posters: Poster[];
    };
};
export default function RocomExchangeCard({ data }: Props): React.JSX.Element;
export {};
