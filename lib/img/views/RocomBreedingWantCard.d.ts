import React from 'react';
type Props = {
    data: {
        target: {
            id: string;
            name: string;
            typeLabel: string;
        };
        eggGroupsLabel: string;
        maleRateLabel: string;
        femaleRateLabel: string;
        isUndiscovered: boolean;
        fathers: Array<{
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
export default function RocomBreedingWantCard({ data }: Props): React.JSX.Element;
export {};
