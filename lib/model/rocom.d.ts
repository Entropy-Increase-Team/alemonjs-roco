type RocomHelpGroup = {
    groupTitle: string;
    menuItems: Array<{
        cmd: string;
        desc: string;
    }>;
};
type HelpCardItem = {
    title: string;
    desc: string;
    example: string;
};
type HelpCardCategory = {
    title: string;
    items: HelpCardItem[];
};
export declare function getRocomCommandPrefixes(): string[];
export declare function getRocomHelpGroups(): Promise<RocomHelpGroup[]>;
export declare function buildRocomHelpText(): Promise<string>;
export declare function buildRocoMainHelpText(): Promise<string>;
export declare function buildRocoWikiHelpText(): Promise<string>;
export declare function getRocomHelpCardData(): Promise<{
    title: string;
    subtitle: string;
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
    categories: HelpCardCategory[];
}>;
export declare function getWeGameHelpCardData(): Promise<{
    title: string;
    subtitle: string;
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
    categories: HelpCardCategory[];
}>;
export declare function getRocoWikiHelpCardData(): Promise<{
    title: string;
    subtitle: string;
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
    categories: HelpCardCategory[];
}>;
export declare function getRocoMainHelpCardData(): Promise<{
    title: string;
    subtitle: string;
    prefixTitle: string;
    prefixText: string;
    footerBrand: string;
    footerNote: string;
    categories: HelpCardCategory[];
}>;
export {};
