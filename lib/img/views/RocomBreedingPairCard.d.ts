import React from 'react';
type Props = {
    data: {
        mother: {
            name: string;
            typeLabel: string;
            eggGroupsLabel: string;
        };
        father: {
            name: string;
            typeLabel: string;
            eggGroupsLabel: string;
        };
        compatible: boolean;
        reasons: string[];
        sharedEggGroupLabels: string[];
        hatchLabel: string;
        weightLabel: string;
        heightLabel: string;
        commandHint: string;
        copyright: string;
    };
};
export default function RocomBreedingPairCard({ data }: Props): React.JSX.Element;
export {};
