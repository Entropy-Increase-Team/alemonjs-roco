import React from 'react';
type Props = {
    data: {
        queryLabel: string;
        hasResults: boolean;
        perfectMatches: Array<{
            id: string;
            name: string;
            icon: string;
            typeLabel: string;
            eggGroupsLabel: string;
            heightLabel: string;
            weightLabel: string;
        }>;
        rangeMatches: Array<{
            id: string;
            name: string;
            icon: string;
            typeLabel: string;
            eggGroupsLabel: string;
            heightLabel: string;
            weightLabel: string;
        }>;
        commandHint: string;
        copyright: string;
    };
};
export default function RocomEggSizeCard({ data }: Props): React.JSX.Element;
export {};
