import React from 'react';
export interface WeGameHelpCardItem {
    title: string;
    desc: string;
}
export interface WeGameHelpCardCategory {
    title: string;
    items: WeGameHelpCardItem[];
}
export interface WeGameHelpCardData {
    title: string;
    subtitle: string;
    categories: WeGameHelpCardCategory[];
    footerBrand: string;
}
export default function WeGameHelpCard({ data }: {
    data: WeGameHelpCardData;
}): React.JSX.Element;
