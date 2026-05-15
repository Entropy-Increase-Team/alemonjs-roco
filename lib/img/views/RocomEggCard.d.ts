import React from 'react';
type Props = {
    data: {
        petName: string;
        petId: string;
        petIcon: string;
        typeLabel: string;
        eggGroups: string[];
        eggGroupsLabel: string;
        maleRate: number | null;
        femaleRate: number | null;
        hatchLabel: string;
        weightLabel: string;
        heightLabel: string;
        totalStats: string;
        totalCompatible: string;
        isUndiscovered: boolean;
        commandHint: string;
        copyright: string;
        sections: Array<{
            id: string;
            label: string;
            count: string;
            members: Array<{
                name: string;
                meta: string;
            }>;
            hasMore: boolean;
            remainCount: string;
        }>;
        eggDetails: null | {
            preciousEggLabel: string;
            baseProbText: string;
            addProbText: string;
            contactAddText: string;
            variantCount: string;
        };
    };
};
export default function RocomEggCard({ data }: Props): React.JSX.Element;
export {};
