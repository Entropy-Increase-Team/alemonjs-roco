import React from 'react';
type Props = {
    data: {
        name: string;
        attribute: string;
        category: string;
        cost: string;
        power: string;
        description: string;
        commandHint: string;
        updatedAt: string;
        copyright: string;
        resultHint: string;
    };
};
export default function SkillWikiCard({ data }: Props): React.JSX.Element;
export {};
