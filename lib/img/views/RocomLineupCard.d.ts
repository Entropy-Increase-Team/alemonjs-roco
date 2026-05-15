import React from 'react';
type LineupPet = {
    name: string;
    imageUrl: string;
};
type LineupData = {
    id: string;
    name: string;
    tags: string[];
    pets: LineupPet[];
    authorName: string;
    likes: number;
};
type Props = {
    data: {
        mode: 'list' | 'detail';
        category: string;
        pageNo: number;
        totalPages: number;
        lineups: LineupData[];
    };
};
export default function RocomLineupCard({ data }: Props): React.JSX.Element;
export {};
