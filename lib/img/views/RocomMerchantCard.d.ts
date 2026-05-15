import React from 'react';
type Props = {
    data: {
        title: string;
        subtitle: string;
        productCount: number;
        roundLabel: string;
        countdown: string;
        products: Array<{
            name: string;
            image: string;
            timeLabel: string;
            type: string;
            slotLabel: string;
        }>;
    };
};
export default function RocomMerchantCard({ data }: Props): React.JSX.Element;
export {};
