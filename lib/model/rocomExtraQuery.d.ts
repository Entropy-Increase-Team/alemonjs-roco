export declare function getRocomHome(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
        MessageText?: string;
    };
}): Promise<{
    rawPayload: Record<string, unknown>;
    uid: string;
    homeName: string;
    roomLevel: string;
    homeLevel: string;
    homeExperience: string;
    comfortLevel: string;
}>;
export declare function buildRocomHomeText(payload: {
    uid: string;
    homeName: string;
    roomLevel: string;
    homeLevel: string;
    homeExperience: string;
    comfortLevel: string;
}): string;
type RocomHomeSummaryCard = {
    label: string;
    value: string;
};
type RocomHomePetCard = {
    id: string;
    name: string;
    level: string;
    iconUrl: string;
    badge: string;
    isGuard: boolean;
    statusText: string;
    statusClass: 'guard' | 'ready' | 'progress' | 'idle';
    note: string;
};
type RocomHomeGardenPlot = {
    id: string;
    landIndex: string;
    plantName: string;
    statusText: string;
    stateType: 'ready' | 'warning';
    leftTimeText: string;
    progress: number;
    harvestText: string;
    stealText: string;
};
export type RocomHomeCardData = {
    title: string;
    subtitle: string;
    homeName: string;
    uid: string;
    updatedAt: string;
    summaryCards: RocomHomeSummaryCard[];
    gardenPlots: RocomHomeGardenPlot[];
    guardPets: RocomHomePetCard[];
    indoorPets: RocomHomePetCard[];
    gardenCount: number;
    indoorCount: number;
    guardCount: number;
    guardEmptyText: string;
};
export declare function buildRocomHomeCardData(payload: Record<string, unknown>, uid: string): RocomHomeCardData;
export declare function getRocomRecord(event: {
    current: {
        Platform?: string;
        BotId?: string;
        UserId?: string;
        MessageText?: string;
    };
}): Promise<{
    pageNo: number;
    currentPage: number;
    finish: boolean;
    role: Record<string, unknown> | {
        id?: string;
        openid?: string;
        name?: string;
        avatar?: string;
        create_time?: string;
        is_online?: boolean;
        level?: number;
        star?: number;
    };
    battleOverview: Record<string, unknown> | {};
    battles: Record<string, unknown>[];
}>;
export declare function buildRocomRecordText(payload: {
    pageNo: number;
    battles: Array<Record<string, unknown>>;
}): string;
export declare function buildRocomRecordCardData(payload: {
    pageNo: number;
    battles: Array<Record<string, unknown>>;
}): {
    userName: string;
    userLevel: string;
    userUid: string;
    userAvatar: string;
    winRate: string;
    totalMatch: string;
    currentPage: number;
    pageText: string;
    footerCommandHint: string;
    battles: Array<{
        leftName: string;
        leftAvatar: string;
        leftPets: Array<{
            name: string;
            icon: string;
        }>;
        rightName: string;
        rightAvatar: string;
        rightPets: Array<{
            name: string;
            icon: string;
        }>;
        resultLabel: string;
        resultKind: 'win' | 'lose';
        time: string;
        date: string;
    }>;
};
export declare function parseRocomSizeArgs(rawText: string): {
    diameter: string;
    weight: string;
};
export declare function getRocomSizeQuery(rawText: string): Promise<{
    args: {
        diameter: string;
        weight: string;
    };
    payload: Record<string, unknown>;
}>;
export declare function buildRocomSizeText(result: {
    args: {
        diameter: string;
        weight: string;
    };
    payload: Record<string, unknown>;
}): string;
export declare function getRocomMerchantInfo(): Promise<Record<string, unknown>>;
export {};
