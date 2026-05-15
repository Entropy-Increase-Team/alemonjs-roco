import React from 'react';
export interface HelpCardItem {
    title: string;
    desc: string;
    example?: string;
}
export interface HelpCardCategory {
    title: string;
    items: HelpCardItem[];
}
export interface HelpCardData {
    title: string;
    subtitle: string;
    categories: HelpCardCategory[];
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
}
export default function YunzaiHelpCard({ data }: {
    data: HelpCardData;
}): React.JSX.Element;
