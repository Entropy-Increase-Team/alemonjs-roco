export type ShareCodePet = {
    slot: number;
    slotText: string;
    color: string;
    pet: {
        id: string;
        name: string;
        icon: string;
    };
    typeIcons: Array<{
        name: string;
    }>;
    bloodline: {
        name: string;
        element: string;
        icon: string;
    };
    personality: {
        id: string;
        name: string;
        up: string;
        down: string;
    };
    ivs_detail: Array<{
        name: string;
    }>;
    skills: Array<{
        name: string;
        icon: string;
    }>;
};
export type ShareCodeTeam = {
    share_code: string;
    mode_name: string;
    magic_icon: string;
    sprite_count: number;
    count_label: string;
    teams: ShareCodePet[];
};
export declare function parseRocomShareCode(shareCode: string, userIdentifier?: string): Promise<Record<string, unknown>>;
export declare function normalizeShareCodeTeam(payload?: Record<string, unknown>, baseUrl?: string): ShareCodeTeam;
export declare function getShareCodeBaseUrl(): Promise<string>;
