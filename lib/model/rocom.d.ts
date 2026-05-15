type RocomHelpGroup = {
    groupTitle: string;
    menuItems: Array<{
        cmd: string;
        desc: string;
    }>;
};
export declare function getRocomCommandPrefixes(): string[];
export declare function getRocomHelpGroups(): Promise<RocomHelpGroup[]>;
export declare function buildRocomHelpText(): Promise<string>;
export {};
