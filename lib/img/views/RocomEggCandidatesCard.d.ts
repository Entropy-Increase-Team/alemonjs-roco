import React from 'react';
type Props = {
    data: {
        keyword: string;
        count: string;
        candidates: Array<{
            id: string;
            name: string;
            typeLabel: string;
            eggGroupsLabel: string;
            heightLabel: string;
            weightLabel: string;
        }>;
        commandHint: string;
        copyright: string;
    };
};
export default function RocomEggCandidatesCard({ data }: Props): React.JSX.Element;
export {};
